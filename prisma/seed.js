const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create users
  const usersData = [
    {
      name: 'Alice Baker',
      email: 'alice@example.com',
      password: await bcrypt.hash('Password123!', 10),
      bio: 'Home cook who loves baking sourdough and pastries.',
    },
    {
      name: 'Bruno Chef',
      email: 'bruno@example.com',
      password: await bcrypt.hash('Password123!', 10),
      bio: 'Professional chef focusing on Italian cuisine.',
    },
    {
      name: 'Carmen Foodie',
      email: 'carmen@example.com',
      password: await bcrypt.hash('Password123!', 10),
      bio: 'Food blogger experimenting with vegan recipes.',
    },
  ]

  const [alice, bruno, carmen] = await Promise.all(
    usersData.map((u) =>
      prisma.user.upsert({
        where: { email: u.email },
        update: {},
        create: u,
      })
    )
  )

  const authors = [alice, bruno, carmen]

  // Simple helper to pick an author
  function author(i) {
    return authors[i % authors.length]
  }

  // Create recipes
  const recipesData = [
    {
      title: 'Classic Margherita Pizza',
      description: 'Crispy pizza with fresh mozzarella and basil.',
      instructions: 'Make dough, add sauce, mozzarella, basil. Bake at 250°C for 8-10 min.',
      imageUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
      prepTime: 20,
      cookTime: 10,
      servings: 2,
      published: true,
    },
    {
      title: 'Creamy Mushroom Risotto',
      description: 'Rich risotto with mixed mushrooms and parmesan.',
      instructions: 'Toast rice, add broth gradually, stir with mushrooms and cheese.',
      imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop',
      prepTime: 15,
      cookTime: 25,
      servings: 4,
      published: true,
    },
    {
      title: 'Vegan Buddha Bowl',
      description: 'Colorful bowl with quinoa, roasted veggies, and tahini dressing.',
      instructions: 'Roast veggies, cook quinoa, assemble with chickpeas and dressing.',
      imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
      prepTime: 20,
      cookTime: 20,
      servings: 2,
      published: true,
    },
    {
      title: 'Spaghetti Carbonara',
      description: 'Silky carbonara with guanciale, pecorino, and egg.',
      instructions: 'Cook pasta, mix eggs and cheese, toss with guanciale off heat.',
      imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=800&h=600&fit=crop',
      prepTime: 10,
      cookTime: 15,
      servings: 2,
      published: true,
    },
    {
      title: 'Grilled Salmon with Lemon',
      description: 'Juicy salmon fillet with lemon-butter sauce.',
      instructions: 'Season salmon, grill skin-side down, finish with lemon-butter.',
      imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop',
      prepTime: 10,
      cookTime: 12,
      servings: 2,
      published: true,
    },
    {
      title: 'Avocado Toast Deluxe',
      description: 'Avocado toast with poached egg and chili flakes.',
      instructions: 'Toast bread, mash avocado, top with egg and seasoning.',
      imageUrl: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800&h=600&fit=crop',
      prepTime: 8,
      cookTime: 4,
      servings: 1,
      published: true,
    },
    {
      title: 'Chicken Tikka Masala',
      description: 'Creamy tomato-based curry with marinated chicken.',
      instructions: 'Marinate chicken, grill, simmer in masala sauce with cream.',
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
      prepTime: 30,
      cookTime: 40,
      servings: 4,
      published: true,
    },
    {
      title: 'Beef Tacos',
      description: 'Spiced beef tacos with salsa and cilantro.',
      instructions: 'Cook beef with spices, warm tortillas, assemble with toppings.',
      imageUrl: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop',
      prepTime: 15,
      cookTime: 15,
      servings: 4,
      published: true,
    },
    {
      title: 'Chocolate Chip Cookies',
      description: 'Chewy cookies packed with chocolate chips.',
      instructions: 'Cream butter and sugar, add eggs, fold chips, bake 12 min.',
      imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop',
      prepTime: 15,
      cookTime: 12,
      servings: 24,
      published: true,
    },
    {
      title: 'Greek Salad',
      description: 'Fresh salad with feta, olives, cucumber, and tomatoes.',
      instructions: 'Chop veggies, crumble feta, dress with olive oil and oregano.',
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&h=600&fit=crop',
      prepTime: 10,
      cookTime: 0,
      servings: 3,
      published: true,
    },
    {
      title: 'Beef Bourguignon',
      description: 'Classic French beef stew with red wine and mushrooms.',
      instructions: 'Brown beef, sauté vegetables, add wine and broth, slow cook until tender.',
      imageUrl: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
      prepTime: 25,
      cookTime: 180,
      servings: 6,
      published: true,
    },
    {
      title: 'Pad Thai',
      description: 'Stir-fried rice noodles with shrimp, tofu, and peanuts.',
      instructions: 'Soak noodles, stir-fry with shrimp and tofu, add sauce and garnish.',
      imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&h=600&fit=crop',
      prepTime: 20,
      cookTime: 15,
      servings: 4,
      published: true,
    },
  ]

  let i = 0
  for (const data of recipesData) {
    const creator = author(i++)
    await prisma.recipe.upsert({
      where: { title_userId: { title: data.title, userId: creator.id } },
      update: {},
      create: {
        ...data,
        user: { connect: { id: creator.id } },
      },
    })
  }

  console.log('Seeding complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 