import { useState } from "react";
import type { ReactNode } from "react";
import { Box, Chip, Dialog, IconButton, Paper, Typography } from "@mui/material";
import { useTranslation, Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  ImageOff,
  Lightbulb,
  Maximize2,
  MapPin,
  Trophy,
  Users2,
  X,
  type LucideIcon,
} from "lucide-react";
import { PageHeader } from "../../../components/common/shell/PageHeader";
import { Button } from "../../../components/ui/button/Button";
import { useAuth } from "../../../services/AuthContext";
import { brand, neutral, radius, statusTone } from "../../../theme";

type StepKey = "group" | "contest" | "problems" | "grade";

interface StepConfig {
  key: StepKey;
  icon: LucideIcon;
  /** Page the "Open this page" button goes to, per role. */
  path: (base: string) => string;
  /** Screenshot file names under public/help/{lang}/. */
  shots: { list: string; form: string };
}

const STEPS: StepConfig[] = [
  {
    key: "group",
    icon: Users2,
    path: (base) => `${base}/groups`,
    shots: { list: "1-groups.png", form: "1-create-group.png" },
  },
  {
    key: "contest",
    icon: Trophy,
    path: (base) => `${base}/groups`,
    shots: { list: "2-group-contests.png", form: "2-create-contest.png" },
  },
  {
    key: "problems",
    icon: BookOpen,
    path: (base) => `${base}/contests`,
    shots: { list: "3-contest-problems.png", form: "3-add-problem.png" },
  },
  {
    key: "grade",
    icon: ClipboardCheck,
    path: (base) => `${base}/contests`,
    shots: { list: "4-student-progress.png", form: "4-grade-solution.png" },
  },
];

// The label a step's text points at, shown the way the real button reads.
const UiLabel = ({ children }: { children?: ReactNode }) => (
  <Box
    component="span"
    sx={{
      display: "inline-block",
      px: 0.85,
      py: 0.1,
      mx: 0.25,
      borderRadius: "6px",
      bgcolor: brand[50],
      border: `1px solid ${brand[200]}`,
      color: brand[600],
      fontWeight: 700,
      fontSize: "0.85em",
      lineHeight: 1.6,
      whiteSpace: "nowrap",
    }}
  >
    {children}
  </Box>
);

interface ScreenshotProps {
  src: string;
  caption: string;
  onOpen: () => void;
}

// A screenshot in a light browser frame. Falls back to a placeholder when the
// image file hasn't been added yet, so the guide never shows a broken image.
const Screenshot = ({ src, caption, onOpen }: ScreenshotProps) => {
  const { t } = useTranslation();
  const [failed, setFailed] = useState(false);

  return (
    <Box component="figure" sx={{ m: 0 }}>
      <Box
        sx={{
          borderRadius: `${radius.lg}px`,
          border: `1px solid ${neutral[200]}`,
          overflow: "hidden",
          bgcolor: neutral[0],
          boxShadow: "0 1px 2px rgba(15, 23, 42, 0.04), 0 8px 24px rgba(15, 23, 42, 0.06)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            py: 1,
            bgcolor: neutral[50],
            borderBottom: `1px solid ${neutral[200]}`,
          }}
        >
          {[neutral[300], neutral[300], neutral[300]].map((c, i) => (
            <Box key={i} sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: c }} />
          ))}
        </Box>
        {failed ? (
          <Box
            sx={{
              aspectRatio: "16 / 10",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: neutral[400],
              bgcolor: neutral[50],
            }}
          >
            <ImageOff size={28} />
            <Typography variant="caption">{t("help.screenshotMissing")}</Typography>
          </Box>
        ) : (
          <Box
            component="button"
            type="button"
            onClick={onOpen}
            aria-label={`${t("help.enlarge")}: ${caption}`}
            sx={{
              position: "relative",
              display: "block",
              width: "100%",
              p: 0,
              border: 0,
              cursor: "zoom-in",
              bgcolor: neutral[0],
              "&:hover .enlarge, &:focus-visible .enlarge": { opacity: 1 },
              "&:focus-visible": { outline: `2px solid ${brand[500]}`, outlineOffset: -2 },
            }}
          >
            <Box
              component="img"
              src={src}
              alt={caption}
              loading="lazy"
              onError={() => setFailed(true)}
              sx={{ display: "block", width: "100%", height: "auto" }}
            />
            <Box
              className="enlarge"
              sx={{
                position: "absolute",
                top: 10,
                insetInlineEnd: 10,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                px: 1,
                py: 0.5,
                borderRadius: `${radius.pill}px`,
                bgcolor: "rgba(15, 23, 42, 0.72)",
                color: neutral[0],
                fontSize: 12,
                fontWeight: 600,
                opacity: 0,
                transition: "opacity 150ms ease",
              }}
            >
              <Maximize2 size={12} />
              {t("help.enlarge")}
            </Box>
          </Box>
        )}
      </Box>
      <Typography
        component="figcaption"
        variant="caption"
        sx={{ display: "block", mt: 1, color: neutral[500], textAlign: "center" }}
      >
        {caption}
      </Typography>
    </Box>
  );
};

export const HelpCenterPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { role } = useAuth();
  const isAdmin = role === "Admin";
  const base = isAdmin ? "/admin" : "/trainer";
  const lang = i18n.language?.startsWith("ar") ? "ar" : "en";
  const [zoomed, setZoomed] = useState<{ src: string; caption: string } | null>(null);

  // Real button and tab names from the app, so the steps always match the UI.
  const labels = {
    myGroups: t(isAdmin ? "navbar.groups" : "navbar.myGroups"),
    createGroup: t("group.list.createGroup"),
    members: t("group.create.members"),
    membersButton: t("ui.groupCard.members"),
    view: t("buttons.view"),
    contestsTab: t("group.details.tabContests"),
    createContest: t("group.details.createContest"),
    submit: t("contest.create.submitButton"),
    contestsPage: t("navbar.contests"),
    problems: t("ui.contestCard.problems"),
    addProblem: t("contest.problems.addButton"),
    createProblem: t("problem.form.createSubmit"),
    progress: t("trainer.studentProgress.titleSuffix"),
    viewSolution: t("trainer.studentProgress.viewSolution"),
    markAsDone: t("trainer.solutionDetail.markAsDone"),
  };

  const whereFor = (key: StepKey) => {
    if (key === "group") return t("help.steps.group.where", { page: labels.myGroups });
    if (key === "contest") return t("help.steps.contest.where", { tab: labels.contestsTab });
    if (key === "problems") return t("help.steps.problems.where", { button: labels.problems });
    return t("help.steps.grade.where");
  };

  const scrollTo = (key: StepKey) =>
    document.getElementById(`help-step-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <Box sx={{ pb: 8, maxWidth: 1180, mx: "auto" }}>
      <PageHeader
        title={t("help.title")}
        subtitle={t("help.subtitle")}
        meta={
          <Chip
            label={t("help.stepsCount")}
            size="small"
            sx={{ bgcolor: brand[50], color: brand[600], fontWeight: 700, border: `1px solid ${brand[200]}` }}
          />
        }
      />

      {/* The flow at a glance; each card jumps to its section. */}
      <Typography
        variant="overline"
        sx={{ display: "block", color: neutral[500], fontWeight: 700, letterSpacing: "0.08em", mb: 1.5 }}
      >
        {t("help.flowTitle")}
      </Typography>
      <Box
        component="ol"
        sx={{
          listStyle: "none",
          p: 0,
          m: 0,
          mb: 5,
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
        }}
      >
        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <Box component="li" key={step.key} sx={{ position: "relative", minWidth: 0 }}>
              <Box
                component="button"
                type="button"
                onClick={() => scrollTo(step.key)}
                sx={{
                  width: "100%",
                  height: "100%",
                  textAlign: "start",
                  font: "inherit",
                  cursor: "pointer",
                  p: 2,
                  borderRadius: `${radius["2xl"]}px`,
                  border: `1px solid ${neutral[200]}`,
                  bgcolor: neutral[0],
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  transition: "border-color 150ms ease, box-shadow 150ms ease",
                  "&:hover": { borderColor: brand[300], boxShadow: "0 4px 14px rgba(139, 29, 35, 0.08)" },
                  "&:focus-visible": { outline: `2px solid ${brand[500]}`, outlineOffset: 2 },
                }}
              >
                <Box
                  sx={{
                    flexShrink: 0,
                    width: 42,
                    height: 42,
                    borderRadius: `${radius.lg}px`,
                    bgcolor: brand[500],
                    color: neutral[0],
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Icon size={20} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: brand[500], fontWeight: 700 }}>
                    {t("help.stepLabel", { number: i + 1 })}
                  </Typography>
                  <Typography sx={{ fontWeight: 700, color: neutral[800], fontSize: 15, lineHeight: 1.3 }}>
                    {t(`help.steps.${step.key}.title`)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box sx={{ display: "grid", gap: 4 }}>
        {STEPS.map((step, i) => {
          const actions = t(`help.steps.${step.key}.actions`, { returnObjects: true }) as string[];
          return (
            <Paper
              key={step.key}
              id={`help-step-${step.key}`}
              component="section"
              elevation={0}
              sx={{
                scrollMarginTop: 24,
                p: { xs: 2.5, md: 4 },
                borderRadius: `${radius["2xl"]}px`,
                border: `1px solid ${neutral[200]}`,
                display: "grid",
                gap: { xs: 3, md: 5 },
                gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) minmax(0, 1.15fr)" },
                alignItems: "start",
              }}
            >
              {/* Instructions */}
              <Box sx={{ minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      bgcolor: brand[50],
                      color: brand[500],
                      border: `1px solid ${brand[200]}`,
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                    }}
                  >
                    {i + 1}
                  </Box>
                  <Typography variant="caption" sx={{ color: brand[500], fontWeight: 700, letterSpacing: "0.04em" }}>
                    {t("help.stepLabel", { number: i + 1 })}
                  </Typography>
                </Box>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 800, color: neutral[900], mb: 0.75 }}>
                  {t(`help.steps.${step.key}.title`)}
                </Typography>
                <Typography sx={{ color: neutral[600], mb: 2 }}>
                  {t(`help.steps.${step.key}.summary`)}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mb: 3 }}>
                  <Chip
                    icon={<MapPin size={14} />}
                    label={whereFor(step.key)}
                    size="small"
                    sx={{
                      bgcolor: neutral[100],
                      color: neutral[700],
                      fontWeight: 600,
                      "& .MuiChip-icon": { color: neutral[500] },
                    }}
                  />
                  <Button
                    variantType="ghost"
                    size="small"
                    endIcon={<Box component={ArrowRight} size={16} sx={{ "[dir=rtl] &": { transform: "scaleX(-1)" } }} />}
                    onClick={() => navigate(step.path(base))}
                  >
                    {t("help.goToPage")}
                  </Button>
                </Box>

                <Box component="ol" sx={{ listStyle: "none", p: 0, m: 0, display: "grid", gap: 1.5 }}>
                  {actions.map((_, idx) => (
                    <Box component="li" key={idx} sx={{ display: "flex", gap: 1.5, alignItems: "flex-start" }}>
                      <Box
                        sx={{
                          flexShrink: 0,
                          mt: "2px",
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          bgcolor: neutral[800],
                          color: neutral[0],
                          display: "grid",
                          placeItems: "center",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        {idx + 1}
                      </Box>
                      <Typography sx={{ color: neutral[700], lineHeight: 1.75, minWidth: 0 }}>
                        <Trans
                          i18nKey={`help.steps.${step.key}.actions.${idx}`}
                          values={labels}
                          components={{ b: <UiLabel /> }}
                        />
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {step.key === "group" && isAdmin && (
                  <Typography variant="body2" sx={{ color: neutral[600], mt: 2 }}>
                    {t("help.steps.group.adminNote")}
                  </Typography>
                )}

                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    display: "flex",
                    gap: 1.5,
                    borderRadius: `${radius.lg}px`,
                    bgcolor: statusTone.warning.bg,
                    border: `1px solid ${statusTone.warning.border}`,
                  }}
                >
                  <Box sx={{ color: statusTone.warning.solid, flexShrink: 0, mt: "2px" }}>
                    <Lightbulb size={18} />
                  </Box>
                  <Typography variant="body2" sx={{ color: statusTone.warning.fg, lineHeight: 1.7 }}>
                    <Box component="span" sx={{ fontWeight: 700 }}>
                      {t("help.tipLabel")}:{" "}
                    </Box>
                    <Trans
                      i18nKey={`help.steps.${step.key}.tip`}
                      values={labels}
                      components={{ b: <UiLabel /> }}
                    />
                  </Typography>
                </Box>
              </Box>

              {/* Screenshots */}
              <Box sx={{ display: "grid", gap: 3, minWidth: 0 }}>
                {(["list", "form"] as const).map((shot) => {
                  const src = `/help/${lang}/${step.shots[shot]}`;
                  const caption = t(`help.steps.${step.key}.shots.${shot}`);
                  return (
                    <Screenshot
                      key={`${lang}-${shot}`}
                      src={src}
                      caption={caption}
                      onOpen={() => setZoomed({ src, caption })}
                    />
                  );
                })}
              </Box>

            </Paper>
          );
        })}
      </Box>

      <Dialog
        open={zoomed != null}
        onClose={() => setZoomed(null)}
        maxWidth={false}
        slotProps={{
          paper: {
            sx: {
              m: 2,
              borderRadius: `${radius["2xl"]}px`,
              overflow: "hidden",
              maxWidth: "calc(100vw - 32px)",
              maxHeight: "calc(100vh - 32px)",
            },
          },
        }}
      >
        {zoomed && (
          <Box sx={{ position: "relative", bgcolor: neutral[50] }}>
            <IconButton
              onClick={() => setZoomed(null)}
              aria-label={t("help.close")}
              sx={{
                position: "absolute",
                top: 8,
                insetInlineEnd: 8,
                bgcolor: neutral[0],
                border: `1px solid ${neutral[200]}`,
                "&:hover": { bgcolor: neutral[100] },
              }}
            >
              <X size={18} />
            </IconButton>
            {/* Fit the whole image on screen: tall shots (long forms) shrink to
                the viewport height instead of being cut off. */}
            <Box
              component="img"
              src={zoomed.src}
              alt={zoomed.caption}
              sx={{
                display: "block",
                mx: "auto",
                width: "auto",
                height: "auto",
                maxWidth: "100%",
                maxHeight: "calc(100vh - 110px)",
                objectFit: "contain",
              }}
            />
            <Typography variant="body2" sx={{ p: 2, textAlign: "center", color: neutral[600] }}>
              {zoomed.caption}
            </Typography>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default HelpCenterPage;
