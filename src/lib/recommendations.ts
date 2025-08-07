import { RecipeWithDetails } from '@/types/recipe'

export interface RecommendationScore {
  recipeId: string
  score: number
  reasons: string[]
}

export interface UserPreferences {
  favoritesCuisines?: string[]
  dietaryRestrictions?: string[]
  preferredCookTime?: number
  favoriteIngredients?: string[]
  dislikedIngredients?: string[]
  preferredMealTypes?: string[]
}

export class RecipeRecommendationEngine {
  private recipes: RecipeWithDetails[]
  private userPreferences: UserPreferences
  private viewHistory: string[] // Recipe IDs viewed by user
  private ratedRecipes: { [recipeId: string]: number } // User ratings

  constructor(
    recipes: RecipeWithDetails[],
    userPreferences: UserPreferences = {},
    viewHistory: string[] = [],
    ratedRecipes: { [recipeId: string]: number } = {}
  ) {
    this.recipes = recipes
    this.userPreferences = userPreferences
    this.viewHistory = viewHistory
    this.ratedRecipes = ratedRecipes
  }

  /**
   * Get personalized recipe recommendations
   */
  getRecommendations(excludeRecipeIds: string[] = [], limit: number = 6): RecipeWithDetails[] {
    const scores = this.calculateRecommendationScores(excludeRecipeIds)
    
    // Sort by score descending and take top recommendations
    const topScores = scores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    // Return recipes with their recommendation scores
    return topScores
      .map(score => this.recipes.find(recipe => recipe.id === score.recipeId))
      .filter(recipe => recipe !== undefined) as RecipeWithDetails[]
  }

  /**
   * Get similar recipes based on a specific recipe
   */
  getSimilarRecipes(baseRecipeId: string, limit: number = 4): RecipeWithDetails[] {
    const baseRecipe = this.recipes.find(r => r.id === baseRecipeId)
    if (!baseRecipe) return []

    const similarities = this.recipes
      .filter(recipe => recipe.id !== baseRecipeId)
      .map(recipe => ({
        recipe,
        similarity: this.calculateSimilarity(baseRecipe, recipe)
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit)

    return similarities.map(s => s.recipe)
  }

  /**
   * Get trending recipes based on ratings and recent activity
   */
  getTrendingRecipes(limit: number = 6, period: 'daily' | 'weekly' | 'monthly' = 'weekly'): RecipeWithDetails[] {
    const now = new Date()
    const periodStart = this.getPeriodStart(now, period)

    return this.recipes
      .filter(recipe => recipe.published)
      .map(recipe => ({
        recipe,
        trendScore: this.calculateTrendScore(recipe, periodStart)
      }))
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit)
      .map(item => item.recipe)
  }

  /**
   * Get trending recipes by category
   */
  getTrendingByCategory(category: string, limit: number = 4): RecipeWithDetails[] {
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const categoryKeywords = this.getCategoryKeywords(category)

    return this.recipes
      .filter(recipe => recipe.published && this.matchesCategory(recipe, categoryKeywords))
      .map(recipe => ({
        recipe,
        trendScore: this.calculateTrendScore(recipe, oneWeekAgo)
      }))
      .sort((a, b) => b.trendScore - a.trendScore)
      .slice(0, limit)
      .map(item => item.recipe)
  }

  /**
   * Get trending recipes for new users (highly rated, popular)
   */
  getTrendingForNewUsers(limit: number = 6): RecipeWithDetails[] {
    return this.recipes
      .filter(recipe =>
        recipe.published &&
        recipe.averageRating &&
        recipe.averageRating >= 4.0 &&
        recipe._count.ratings >= 3
      )
      .map(recipe => ({
        recipe,
        newUserScore: this.calculateNewUserScore(recipe)
      }))
      .sort((a, b) => b.newUserScore - a.newUserScore)
      .slice(0, limit)
      .map(item => item.recipe)
  }

  /**
   * Get recipes for specific occasions or moods
   */
  getRecipesForOccasion(occasion: string, limit: number = 6): RecipeWithDetails[] {
    const occasionKeywords = this.getOccasionKeywords(occasion)
    
    return this.recipes
      .filter(recipe => recipe.published)
      .map(recipe => ({
        recipe,
        relevance: this.calculateOccasionRelevance(recipe, occasionKeywords)
      }))
      .filter(item => item.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit)
      .map(item => item.recipe)
  }

  /**
   * Calculate recommendation scores for all recipes
   */
  private calculateRecommendationScores(excludeRecipeIds: string[]): RecommendationScore[] {
    return this.recipes
      .filter(recipe => 
        recipe.published && 
        !excludeRecipeIds.includes(recipe.id)
      )
      .map(recipe => {
        const reasons: string[] = []
        let score = 0

        // Base score from average rating
        score += (recipe.averageRating || 0) * 10
        if (recipe.averageRating && recipe.averageRating >= 4.5) {
          reasons.push('Highly rated')
        }

        // Cuisine preference bonus
        if (this.userPreferences.favoritesCuisines?.length) {
          const cuisineMatch = this.matchesCuisinePreference(recipe)
          if (cuisineMatch) {
            score += 25
            reasons.push('Matches your cuisine preferences')
          }
        }

        // Dietary restrictions compliance
        if (this.userPreferences.dietaryRestrictions?.length) {
          const dietaryMatch = this.matchesDietaryRestrictions(recipe)
          if (dietaryMatch) {
            score += 20
            reasons.push('Fits your dietary needs')
          }
        }

        // Cook time preference
        if (this.userPreferences.preferredCookTime) {
          const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)
          if (totalTime <= this.userPreferences.preferredCookTime) {
            score += 15
            reasons.push('Quick to make')
          }
        }

        // Meal type preference
        if (this.userPreferences.preferredMealTypes?.length) {
          const mealTypeMatch = this.matchesMealTypePreference(recipe)
          if (mealTypeMatch) {
            score += 15
            reasons.push('Perfect for your preferred meal times')
          }
        }

        // Popularity bonus (number of ratings)
        if (recipe._count.ratings > 10) {
          score += 10
          reasons.push('Popular choice')
        }

        // Recency bonus for newer recipes
        const daysSinceCreated = Math.floor(
          (Date.now() - recipe.createdAt.getTime()) / (1000 * 60 * 60 * 24)
        )
        if (daysSinceCreated <= 7) {
          score += 8
          reasons.push('Recently added')
        }

        // Collaborative filtering based on similar users' preferences
        score += this.getCollaborativeFilteringScore(recipe)

        return {
          recipeId: recipe.id,
          score: Math.max(0, score),
          reasons
        }
      })
  }

  /**
   * Calculate similarity between two recipes
   */
  private calculateSimilarity(recipe1: RecipeWithDetails, recipe2: RecipeWithDetails): number {
    let similarity = 0

    // Title similarity (basic keyword matching)
    const title1Words = recipe1.title.toLowerCase().split(' ')
    const title2Words = recipe2.title.toLowerCase().split(' ')
    const commonTitleWords = title1Words.filter(word => title2Words.includes(word))
    similarity += commonTitleWords.length * 5

    // Description similarity
    if (recipe1.description && recipe2.description) {
      const desc1Words = recipe1.description.toLowerCase().split(' ')
      const desc2Words = recipe2.description.toLowerCase().split(' ')
      const commonDescWords = desc1Words.filter(word => desc2Words.includes(word))
      similarity += commonDescWords.length * 2
    }

    // Cook time similarity
    const time1 = (recipe1.prepTime || 0) + (recipe1.cookTime || 0)
    const time2 = (recipe2.prepTime || 0) + (recipe2.cookTime || 0)
    const timeDiff = Math.abs(time1 - time2)
    if (timeDiff <= 15) similarity += 10
    else if (timeDiff <= 30) similarity += 5

    // Servings similarity
    const servingsDiff = Math.abs((recipe1.servings || 0) - (recipe2.servings || 0))
    if (servingsDiff <= 1) similarity += 5

    // Rating similarity
    const rating1 = recipe1.averageRating || 0
    const rating2 = recipe2.averageRating || 0
    const ratingDiff = Math.abs(rating1 - rating2)
    if (ratingDiff <= 0.5) similarity += 8

    return similarity
  }

  /**
   * Calculate trend score for a recipe with advanced metrics
   */
  private calculateTrendScore(recipe: RecipeWithDetails, since: Date): number {
    let score = 0
    const now = new Date()
    const daysSinceCreated = Math.floor((now.getTime() - recipe.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    
    // Base score from rating with weighted importance
    const ratingScore = (recipe.averageRating || 0) * 20
    score += ratingScore

    // Recent activity bonus with time decay
    if (recipe.createdAt >= since) {
      const recencyMultiplier = Math.max(0.1, 1 - (daysSinceCreated / 30)) // Decay over 30 days
      score += 40 * recencyMultiplier
    }

    // Engagement rate (ratings per day since creation)
    if (daysSinceCreated > 0) {
      const engagementRate = recipe._count.ratings / Math.max(daysSinceCreated, 1)
      score += Math.min(engagementRate * 15, 50) // Cap at 50 points
    }

    // Popularity with diminishing returns
    const popularityScore = Math.log(recipe._count.ratings + 1) * 8
    score += Math.min(popularityScore, 60)

    // Quality threshold bonus
    if (recipe.averageRating && recipe.averageRating >= 4.5 && recipe._count.ratings >= 3) {
      score += 35 // Higher bonus for consistently high-rated recipes
    }

    // Velocity bonus (rapid rating accumulation)
    if (daysSinceCreated <= 7 && recipe._count.ratings >= 5) {
      score += 25 // Viral potential
    }

    // Balanced recipe bonus (good rating + reasonable engagement)
    if (recipe.averageRating && recipe.averageRating >= 4.0 && recipe._count.ratings >= 2) {
      score += 15
    }

    return Math.max(0, score)
  }

  /**
   * Calculate relevance for specific occasions
   */
  private calculateOccasionRelevance(recipe: RecipeWithDetails, keywords: string[]): number {
    let relevance = 0
    const title = recipe.title.toLowerCase()
    const description = (recipe.description || '').toLowerCase()

    keywords.forEach(keyword => {
      if (title.includes(keyword)) relevance += 10
      if (description.includes(keyword)) relevance += 5
    })

    return relevance
  }

  /**
   * Get keywords for different occasions
   */
  private getOccasionKeywords(occasion: string): string[] {
    const occasionMap: { [key: string]: string[] } = {
      'quick_meals': ['quick', 'fast', 'easy', 'simple', '15', '20', '30'],
      'comfort_food': ['comfort', 'hearty', 'warm', 'cozy', 'classic', 'traditional'],
      'healthy': ['healthy', 'light', 'fresh', 'nutritious', 'low-fat', 'vegetable'],
      'party': ['party', 'crowd', 'entertaining', 'appetizer', 'finger', 'sharing'],
      'romantic': ['romantic', 'elegant', 'special', 'date', 'intimate', 'fancy'],
      'family': ['family', 'kid-friendly', 'crowd', 'large', 'sharing', 'traditional'],
      'weekend': ['weekend', 'leisurely', 'slow', 'project', 'special', 'indulgent']
    }

    return occasionMap[occasion] || []
  }

  /**
   * Check if recipe matches cuisine preferences
   */
  private matchesCuisinePreference(recipe: RecipeWithDetails): boolean {
    if (!this.userPreferences.favoritesCuisines?.length) return false

    const title = recipe.title.toLowerCase()
    const description = (recipe.description || '').toLowerCase()

    return this.userPreferences.favoritesCuisines.some(cuisine => {
      const cuisineKeywords = this.getCuisineKeywords(cuisine)
      return cuisineKeywords.some(keyword => 
        title.includes(keyword) || description.includes(keyword)
      )
    })
  }

  /**
   * Check if recipe matches dietary restrictions
   */
  private matchesDietaryRestrictions(recipe: RecipeWithDetails): boolean {
    if (!this.userPreferences.dietaryRestrictions?.length) return false

    const title = recipe.title.toLowerCase()
    const description = (recipe.description || '').toLowerCase()

    return this.userPreferences.dietaryRestrictions.some(diet => {
      const dietKeywords = this.getDietaryKeywords(diet)
      return dietKeywords.some(keyword => 
        title.includes(keyword) || description.includes(keyword)
      )
    })
  }

  /**
   * Check if recipe matches meal type preferences
   */
  private matchesMealTypePreference(recipe: RecipeWithDetails): boolean {
    if (!this.userPreferences.preferredMealTypes?.length) return false

    const title = recipe.title.toLowerCase()
    const description = (recipe.description || '').toLowerCase()

    return this.userPreferences.preferredMealTypes.some(mealType => {
      const mealKeywords = this.getMealTypeKeywords(mealType)
      return mealKeywords.some((keyword: string) =>
        title.includes(keyword) || description.includes(keyword)
      )
    })
  }

  /**
   * Get collaborative filtering score
   */
  private getCollaborativeFilteringScore(recipe: RecipeWithDetails): number {
    // Simplified collaborative filtering
    // In a real app, this would use user similarity and rating patterns
    let score = 0

    // If user has rated similar recipes highly, boost this recipe
    if (Object.keys(this.ratedRecipes).length > 0) {
      const avgUserRating = Object.values(this.ratedRecipes).reduce((a, b) => a + b, 0) / Object.keys(this.ratedRecipes).length
      if (avgUserRating >= 4 && recipe.averageRating && recipe.averageRating >= 4) {
        score += 10
      }
    }

    return score
  }

  /**
   * Get keywords for cuisine types
   */
  private getCuisineKeywords(cuisine: string): string[] {
    const cuisineMap: { [key: string]: string[] } = {
      'Italian': ['pasta', 'pizza', 'italian', 'parmesan', 'basil', 'tomato'],
      'Asian': ['asian', 'stir', 'soy', 'ginger', 'sesame', 'rice'],
      'Mexican': ['mexican', 'tacos', 'salsa', 'avocado', 'lime', 'cilantro'],
      'Mediterranean': ['mediterranean', 'olive', 'feta', 'herbs', 'lemon'],
      'American': ['american', 'burger', 'bbq', 'classic'],
      'French': ['french', 'cream', 'butter', 'wine', 'herbs'],
      'Indian': ['indian', 'curry', 'spices', 'turmeric', 'cumin'],
      'Thai': ['thai', 'coconut', 'lime', 'chili', 'lemongrass'],
      'Chinese': ['chinese', 'wok', 'soy', 'ginger', 'garlic'],
      'Japanese': ['japanese', 'sushi', 'miso', 'sake', 'seaweed']
    }

    return cuisineMap[cuisine] || []
  }

  /**
   * Get keywords for dietary restrictions
   */
  private getDietaryKeywords(diet: string): string[] {
    const dietMap: { [key: string]: string[] } = {
      'Vegetarian': ['vegetarian', 'vegetable', 'plant', 'mushroom'],
      'Vegan': ['vegan', 'plant', 'coconut', 'tofu', 'cashew'],
      'Gluten-Free': ['gluten-free', 'rice', 'quinoa', 'almond'],
      'Dairy-Free': ['dairy-free', 'coconut', 'almond', 'oat'],
      'Keto': ['keto', 'low-carb', 'high-fat', 'avocado'],
      'Low-Carb': ['low-carb', 'protein', 'meat', 'fish'],
      'Paleo': ['paleo', 'natural', 'whole', 'unprocessed'],
      'Halal': ['halal', 'lamb', 'chicken', 'beef']
    }

    return dietMap[diet] || []
  }

  /**
   * Get keywords for meal types
   */
  private getMealTypeKeywords(mealType: string): string[] {
    const mealMap: { [key: string]: string[] } = {
      'Breakfast': ['breakfast', 'morning', 'pancake', 'eggs', 'toast', 'cereal'],
      'Lunch': ['lunch', 'sandwich', 'salad', 'soup', 'wrap'],
      'Dinner': ['dinner', 'main', 'entree', 'roast', 'steak', 'pasta'],
      'Snack': ['snack', 'appetizer', 'bite', 'finger', 'quick'],
      'Dessert': ['dessert', 'sweet', 'cake', 'cookie', 'chocolate', 'ice cream'],
      'Brunch': ['brunch', 'weekend', 'eggs', 'pancake', 'french toast']
    }

    return mealMap[mealType] || []
  }

  /**
   * Get period start date for trending calculations
   */
  private getPeriodStart(now: Date, period: 'daily' | 'weekly' | 'monthly'): Date {
    const periodMap = {
      'daily': 1,
      'weekly': 7,
      'monthly': 30
    }
    const days = periodMap[period]
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
  }

  /**
   * Calculate score for new users (emphasizes quality and popularity)
   */
  private calculateNewUserScore(recipe: RecipeWithDetails): number {
    let score = 0

    // Heavy weight on rating quality
    score += (recipe.averageRating || 0) * 30

    // Popularity factor
    score += Math.min(recipe._count.ratings * 3, 60)

    // Consistency bonus (high rating with good sample size)
    if (recipe.averageRating && recipe.averageRating >= 4.5 && recipe._count.ratings >= 5) {
      score += 40
    }

    // Accessibility bonus (reasonable cook time)
    const totalTime = (recipe.prepTime || 0) + (recipe.cookTime || 0)
    if (totalTime > 0 && totalTime <= 60) {
      score += 20
    }

    return score
  }

  /**
   * Check if recipe matches category
   */
  private matchesCategory(recipe: RecipeWithDetails, keywords: string[]): boolean {
    const title = recipe.title.toLowerCase()
    const description = (recipe.description || '').toLowerCase()

    return keywords.some(keyword =>
      title.includes(keyword) || description.includes(keyword)
    )
  }

  /**
   * Get keywords for trending categories
   */
  private getCategoryKeywords(category: string): string[] {
    const categoryMap: { [key: string]: string[] } = {
      'desserts': ['dessert', 'cake', 'cookie', 'sweet', 'chocolate', 'ice cream', 'pie'],
      'main_dishes': ['main', 'dinner', 'entree', 'chicken', 'beef', 'pasta', 'rice'],
      'appetizers': ['appetizer', 'starter', 'snack', 'finger', 'dip', 'bite'],
      'breakfast': ['breakfast', 'morning', 'pancake', 'eggs', 'toast', 'oatmeal'],
      'healthy': ['healthy', 'light', 'fresh', 'salad', 'vegetable', 'low-fat'],
      'comfort': ['comfort', 'hearty', 'warm', 'cozy', 'classic', 'traditional'],
      'quick': ['quick', 'fast', 'easy', 'simple', '15', '20', '30 min'],
      'international': ['italian', 'asian', 'mexican', 'french', 'indian', 'thai'],
      'african': ['african', 'cameroon', 'nigerian', 'ghanaian', 'ethiopian', 'moroccan'],
      'vegetarian': ['vegetarian', 'veggie', 'plant', 'meatless', 'vegetable']
    }

    return categoryMap[category] || []
  }
}