import { v4 as uuidv4 } from 'uuid';
import { Course, SkillGapItem, RecommendedCourseItem, RecommendationReport } from '../types';
import { dbService } from './firestore.service';

export class RecommendationService {
  /**
   * Generates a sequenced, ordered learning path prioritizing foundational skills before advanced ones.
   */
  async generateLearningPath(
    userId: string,
    trackId: string,
    gaps: SkillGapItem[],
    existingCompletedCourseIds: string[] = []
  ): Promise<RecommendationReport> {
    const allCourses = await dbService.getCourses();

    // Map skill gaps by skillId for quick lookup of priority & deficit
    const gapMap = new Map<string, SkillGapItem>();
    gaps.forEach(g => gapMap.set(g.skillId, g));

    // Filter courses that address at least one identified skill gap
    const relevantCourses: { course: Course; priorityScore: number }[] = [];

    allCourses.forEach(course => {
      let addressesGap = false;
      let highestGapScore = 0;

      course.skillTags.forEach(tag => {
        const gap = gapMap.get(tag);
        if (gap && gap.currentLevel < gap.requiredLevel) {
          addressesGap = true;
          if (gap.gapScore > highestGapScore) {
            highestGapScore = gap.gapScore;
          }
        }
      });

      if (addressesGap) {
        // Tie-breaker level weights: Foundational = 1000, Intermediate = 500, Advanced = 100
        const tierBase = course.level === 'foundational' ? 1000 : course.level === 'intermediate' ? 500 : 100;
        const priorityScore = tierBase + highestGapScore;
        relevantCourses.push({ course, priorityScore });
      }
    });

    // Sort strictly: Foundational tier first, then by priority/gap score descending, then rating
    relevantCourses.sort((a, b) => {
      if (a.course.level !== b.course.level) {
        const order = { foundational: 1, intermediate: 2, advanced: 3 };
        return order[a.course.level] - order[b.course.level];
      }
      if (b.priorityScore !== a.priorityScore) {
        return b.priorityScore - a.priorityScore;
      }
      return b.course.rating - a.course.rating;
    });

    // If no specific courses matched gaps (e.g. beginner with all skills 0), fall back to all track courses
    let selectedCourses = relevantCourses.map(r => r.course);
    if (selectedCourses.length === 0) {
      selectedCourses = allCourses.slice(0, 5);
    }

    // Deduplicate by ID
    const seen = new Set<string>();
    const deduplicatedCourses: Course[] = [];
    selectedCourses.forEach(c => {
      if (!seen.has(c.id)) {
        seen.add(c.id);
        deduplicatedCourses.push(c);
      }
    });

    // Construct ordered learning path with status
    let firstIncompleteFound = false;
    const completedSet = new Set(existingCompletedCourseIds);

    const path: RecommendedCourseItem[] = deduplicatedCourses.map((course, index) => {
      const isCompleted = completedSet.has(course.id);
      let status: 'current' | 'locked' | 'completed' = 'locked';

      if (isCompleted) {
        status = 'completed';
      } else if (!firstIncompleteFound) {
        status = 'current';
        firstIncompleteFound = true;
      }

      return {
        courseId: course.id,
        title: course.title,
        provider: course.provider,
        duration: course.duration,
        level: course.level,
        skillTags: course.skillTags,
        order: index + 1,
        completed: isCompleted,
        status
      };
    });

    const completedCourses = path.filter(p => p.completed).length;
    const totalCourses = path.length;
    const completionPercentage = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;

    const report: RecommendationReport = {
      id: `rec-${uuidv4().slice(0, 8)}`,
      userId,
      trackId,
      path,
      totalCourses,
      completedCourses,
      completionPercentage,
      generatedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dbService.saveRecommendation(report);
    return report;
  }
}

export const recommendationService = new RecommendationService();
