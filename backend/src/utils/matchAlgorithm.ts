import { IUser } from '../models/User';
import { IJob } from '../models/Job';

/**
 * Calculates a match score (0-100) between a candidate and a job.
 * 
 * Weights:
 * - Skills Match: 60%
 * - Experience Match: 30%
 * - Category Match: 10%
 */
export const calculateMatchScore = (candidate: IUser, job: IJob): number => {
  let score = 0;
  
  // 1. Category Match (10 points max)
  // Simple NLP/String match logic (in production, use embedding models or proper ontologies)
  if (candidate.headline && job.category) {
    if (candidate.headline.toLowerCase().includes(job.category.toLowerCase())) {
      score += 10;
    } else {
      score += 5; // Partial credit if they are at least in a related field
    }
  }

  // 2. Experience Match (30 points max)
  // Assuming job description implies experience if not explicitly stated in a model field
  // We'll give a baseline score, and add based on candidate experience
  if (candidate.experience !== undefined) {
    if (candidate.experience >= 5) {
      score += 30; // Senior
    } else if (candidate.experience >= 2) {
      score += 20; // Mid
    } else {
      score += 10; // Entry
    }
  } else {
    score += 15; // Unknown experience, give average
  }

  // 3. Skills Match (60 points max)
  if (candidate.skills && candidate.skills.length > 0 && job.requirements && job.requirements.length > 0) {
    const jobReqsString = job.requirements.join(' ').toLowerCase();
    
    let matchedSkills = 0;
    candidate.skills.forEach(skill => {
      if (jobReqsString.includes(skill.toLowerCase())) {
        matchedSkills++;
      }
    });

    // Calculate percentage of candidate skills that apply to the job requirements
    // For a highly accurate system, we'd extract keywords from requirements first.
    const skillMatchPercentage = Math.min(matchedSkills / (candidate.skills.length > 0 ? candidate.skills.length : 1), 1);
    score += (skillMatchPercentage * 60);
  } else {
    // If skills are missing from either, give a neutral middle ground
    score += 30; 
  }

  return Math.round(Math.min(score, 100)); // Ensure it doesn't exceed 100
};
