const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isText = (value) => typeof value === "string";
const isScore = (value) => Number.isFinite(value) && value >= 0 && value <= 100;
const isTextList = (value) => Array.isArray(value) && value.every(isText);
const hasText = (value, fields) => isObject(value) && fields.every((field) => isText(value[field]));
const isListOf = (value, validate) => Array.isArray(value) && value.every(validate);

export function parseAnalysis(text) {
  const json = text.match(/\{[\s\S]*\}/)?.[0];
  if (!json) throw new Error("No JSON analysis found in response");
  const result = JSON.parse(json);
  const valid = isObject(result)
    && ["atsScore", "keywordMatchScore", "formattingScore", "impactScore"].every((field) => isScore(result[field]))
    && isText(result.summary) && result.summary.trim().length > 0
    && ["missingKeywords", "actionVerbs", "quickWins"].every((field) => isTextList(result[field]))
    && isListOf(result.weakBullets, (bullet) => hasText(bullet, ["original", "improved"])
      && (bullet.tip === undefined || isText(bullet.tip)))
    && isListOf(result.formattingIssues, (issue) => hasText(issue, ["title", "detail"])
      && (issue.icon === undefined || isText(issue.icon))
      && (issue.severity === undefined || isText(issue.severity)))
    && isListOf(result.recommendedRoles, (role) => hasText(role, ["title", "reason"])
      && isScore(role.matchPercent) && isTextList(role.matchedSkills) && isTextList(role.skillsToLearn))
    && (result.jobMatch === null || (hasText(result.jobMatch, ["verdict"])
      && isScore(result.jobMatch.matchPercent)
      && isTextList(result.jobMatch.matched) && isTextList(result.jobMatch.missing)));
  if (!valid) throw new Error("AI response did not match the resume analysis format");
  return result;
}
