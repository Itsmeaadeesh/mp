import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { dbService } from '../services/firestore.service';
import { Course } from '../types';

const router = Router();

// GET /api/courses - List courses with optional filtering
router.get('/courses', async (req: Request, res: Response) => {
  try {
    const { skill, level } = req.query as { skill?: string; level?: string };
    let courses = await dbService.getCourses();

    if (skill) {
      courses = courses.filter(c => c.skillTags.includes(skill));
    }
    if (level) {
      courses = courses.filter(c => c.level === level);
    }

    return res.json({ success: true, count: courses.length, courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// POST /api/courses - Add course to catalogue (admin)
router.post('/courses', async (req: Request, res: Response) => {
  try {
    const { title, provider, description, url, duration, rating, level, skillTags } = req.body;

    if (!title || !provider || !level || !skillTags) {
      return res.status(400).json({ error: 'title, provider, level, and skillTags are required' });
    }

    const newCourse: Course = {
      id: `c-custom-${uuidv4().slice(0, 8)}`,
      title,
      provider,
      description: description || 'Comprehensive practical course.',
      url: url || 'https://skillsetu.io',
      duration: duration || '6 hours',
      rating: rating ? Number(rating) : 4.8,
      level,
      skillTags: Array.isArray(skillTags) ? skillTags : [skillTags]
    };

    const saved = await dbService.saveCourse(newCourse);
    return res.status(201).json({ success: true, course: saved });
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({ error: 'Failed to create course' });
  }
});

// PUT /api/courses/:id - Update course in catalogue (admin)
router.put('/courses/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await dbService.getCourse(id);
    if (!existing) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const updated: Course = {
      ...existing,
      ...req.body,
      id // preserve ID
    };

    const saved = await dbService.saveCourse(updated);
    return res.json({ success: true, course: saved });
  } catch (error) {
    console.error('Error updating course:', error);
    return res.status(500).json({ error: 'Failed to update course' });
  }
});

// DELETE /api/courses/:id - Delete course from catalogue (admin)
router.delete('/courses/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await dbService.deleteCourse(id);
    return res.json({ success: true, message: `Course ${id} deleted successfully` });
  } catch (error) {
    console.error('Error deleting course:', error);
    return res.status(500).json({ error: 'Failed to delete course' });
  }
});

export default router;
