import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { Users, ArrowRight } from 'lucide-react';
import {
  PageContainer,
  HeaderSection,
  TitleBox,
  IconBadge,
  HeaderStats,
  StatCard,
  StatValue,
  StatLabel,
  CoursesGrid,
  CourseCardStyled,
  CardHeaderStyled,
  CourseIcon,
  CourseTitle,
  CourseSubtitle,
  CardBody,
  StatsRow,
  StatBox,
  StatBoxValue,
  StatBoxLabel,
  ProgressSection,
  ProgressLabel,
  ProgressLabelText,
  ProgressPercentage,
  StyledLinearProgress,
  CardFooter,
  ActionButton,
  DifficultyBadge,
  mockCourses,
  getProgressColor,
  getCourseIcon
} from './groupStyle';

export const CoursesPage: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleViewDetails = (id: string) => {
    console.log('View details for course', id);
  };

  const totalStudents = mockCourses.reduce((sum, course) => sum + course.studentsCount, 0);
  const avgProgress = Math.round(
    mockCourses.reduce((sum, course) => sum + course.progressPercent, 0) / mockCourses.length
  );

  return (
    <PageContainer>
      <HeaderSection>
        <TitleBox>
          <IconBadge>📚</IconBadge>
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: '#1e293b',
                letterSpacing: '-0.5px',
              }}
            >
              My Courses
            </Typography>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#64748b',
                fontWeight: 500,
                marginTop: '6px',
              }}
            >
              Track your progress across different subjects
            </Typography>
          </Box>
        </TitleBox>

        <HeaderStats>
          <StatCard>
            <Box sx={{ fontSize: '18px' }}>📊</Box>
            <Box>
              <StatValue>{mockCourses.length}</StatValue>
              <StatLabel>Courses</StatLabel>
            </Box>
          </StatCard>
          <StatCard>
            <Box sx={{ fontSize: '18px' }}>👥</Box>
            <Box>
              <StatValue>{totalStudents}</StatValue>
              <StatLabel>Students</StatLabel>
            </Box>
          </StatCard>
          <StatCard>
            <Box sx={{ fontSize: '18px' }}>📈</Box>
            <Box>
              <StatValue>{avgProgress}%</StatValue>
              <StatLabel>Avg Progress</StatLabel>
            </Box>
          </StatCard>
        </HeaderStats>
      </HeaderSection>

      <CoursesGrid>
        {mockCourses.map((course, index) => {
          const progressColor = getProgressColor(course.progressPercent);
          const courseIcon = getCourseIcon(index);

          return (
            <CourseCardStyled
              key={course.id}
              onMouseEnter={() => setHoveredCard(course.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <DifficultyBadge label={progressColor.label} size="small" />

              <CardHeaderStyled>
                <CourseIcon>{courseIcon}</CourseIcon>
                <Box sx={{ flex: 1 }}>
                  <CourseTitle>{course.title}</CourseTitle>
                  <CourseSubtitle>
                    <Users size={14} />
                    {course.studentsCount} students
                  </CourseSubtitle>
                </Box>
              </CardHeaderStyled>

              <CardBody>
                <StatsRow>
                  <StatBox>
                    <StatBoxValue>{course.progressPercent}%</StatBoxValue>
                    <StatBoxLabel>Progress</StatBoxLabel>
                  </StatBox>
                  <Box sx={{ width: '1px', backgroundColor: '#e2e8f0' }} />
                  <StatBox>
                    <StatBoxValue>{course.studentsCount}</StatBoxValue>
                    <StatBoxLabel>Learners</StatBoxLabel>
                  </StatBox>
                </StatsRow>

                <ProgressSection>
                  <ProgressLabel>
                    <ProgressLabelText>Learning Progress</ProgressLabelText>
                    <ProgressPercentage>{course.progressPercent}%</ProgressPercentage>
                  </ProgressLabel>
                  <StyledLinearProgress variant="determinate" value={course.progressPercent} />
                </ProgressSection>
              </CardBody>

              <CardFooter>
                <ActionButton
                  variant="outlined"
                  size="small"
                  onClick={() => handleViewDetails(course.id)}
                  endIcon={hoveredCard === course.id ? <ArrowRight size={16} /> : undefined}
                >
                  View
                </ActionButton>
                <ActionButton
                  variant="contained"
                  size="small"
                  endIcon={hoveredCard === course.id ? <ArrowRight size={16} /> : undefined}
                >
                  Continue
                </ActionButton>
              </CardFooter>
            </CourseCardStyled>
          );
        })}
      </CoursesGrid>
    </PageContainer>
  );
};

export default CoursesPage;