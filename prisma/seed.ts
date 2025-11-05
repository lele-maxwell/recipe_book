import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

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
  function author(i: number) {
    return authors[i % authors.length]
  }

  // Create recipes - Featuring African Cuisine
  const recipesData = [
    {
      title: 'Jollof Rice',
      description: 'West African one-pot rice dish cooked in a rich tomato sauce with spices. A beloved staple across Nigeria, Ghana, and Senegal.',
      instructions: `# Jollof Rice

## Ingredients
- 3 cups long-grain parboiled rice
- 1/4 cup vegetable oil
- 1 large onion, diced
- 3 cloves garlic, minced
- 2 tbsp tomato paste
- 400g canned tomatoes
- 2 cups chicken or vegetable stock
- 2 bay leaves
- 1 tsp thyme
- 1 tsp curry powder
- 2 scotch bonnet peppers (adjust to taste)
- Salt and pepper to taste

## Instructions
1. Blend tomatoes, onion, and scotch bonnet peppers until smooth
2. Heat oil in a large pot, fry tomato paste for 2 minutes
3. Add blended mixture and cook for 15-20 minutes until oil separates
4. Add stock, bay leaves, thyme, curry powder, salt and pepper
5. Bring to boil, add rice, stir well
6. Cover tightly and cook on low heat for 30-40 minutes until rice is tender
7. Fluff with fork and serve hot

Perfect with fried plantains and grilled chicken!`,
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Le_Eru%2C_un_plat_camerounais.jpg',
      prepTime: 20,
      cookTime: 60,
      servings: 6,
      published: true,
    },
    {
      title: 'Suya (Nigerian Spiced Kebabs)',
      description: 'Smoky grilled meat skewers coated in a spicy peanut spice mix called yaji. A popular West African street food.',
      instructions: `# Suya - Nigerian Spiced Kebabs

## Ingredients
- 1kg beef sirloin, thinly sliced
- 1/2 cup roasted peanuts, ground
- 2 tbsp paprika
- 1 tbsp cayenne pepper
- 1 tbsp ginger powder
- 1 tbsp garlic powder
- 1 tsp onion powder
- 1/2 tsp salt
- 2 tbsp vegetable oil
- Wooden skewers (soaked in water)

## Instructions
1. Mix all spices with ground peanuts to make suya spice (yaji)
2. Thread beef strips onto skewers
3. Brush with oil and coat generously with suya spice
4. Let marinate for 30 minutes
5. Grill over medium-high heat for 3-4 minutes per side
6. Sprinkle with more suya spice before serving
7. Serve with sliced onions, tomatoes, and cabbage

A perfect appetizer or main dish!`,
      imageUrl: 'https://cdn.pixabay.com/photo/2019/08/12/14/17/suya-4400285_1280.jpg',
      prepTime: 40,
      cookTime: 15,
      servings: 4,
      published: true,
    },
    {
      title: 'Bobotie (South African Curried Mince)',
      description: 'A fragrant South African dish with spiced minced meat topped with a golden egg custard. Sweet, savory, and utterly delicious.',
      instructions: `# Bobotie - South African Classic

## Ingredients
- 1kg beef or lamb mince
- 2 onions, chopped
- 2 slices white bread, soaked in milk
- 2 tbsp curry powder
- 1 tbsp turmeric
- 2 tbsp apricot jam
- 2 tbsp chutney
- 1/4 cup raisins
- 1/4 cup slivered almonds
- 2 eggs
- 1 cup milk
- 6 bay leaves
- Salt and pepper

## Instructions
1. Preheat oven to 180°C (350°F)
2. Sauté onions until soft, add curry and turmeric
3. Add mince, cook until browned
4. Squeeze bread and add to mince with jam, chutney, raisins, almonds
5. Season and transfer to baking dish
6. Beat eggs with milk, pour over mince
7. Place bay leaves on top
8. Bake for 45 minutes until golden
9. Serve with yellow rice and sambals`,
      imageUrl: 'https://cdn.pixabay.com/photo/2018/03/31/19/29/bobotie-3275557_1280.jpg',
      prepTime: 25,
      cookTime: 45,
      servings: 6,
      published: true,
    },
    {
      title: 'Peri-Peri Chicken',
      description: 'Mozambican-Portuguese flame-grilled chicken marinated in fiery peri-peri sauce. Spicy, tangy, and irresistibly flavorful.',
      instructions: `# Peri-Peri Chicken

## Ingredients
- 1 whole chicken, butterflied
- 6-8 red bird's eye chilies
- 4 cloves garlic
- 1 red bell pepper
- Juice of 2 lemons
- 1/4 cup olive oil
- 2 tbsp paprika
- 1 tbsp oregano
- 1 tsp salt

## Instructions
1. Blend chilies, garlic, bell pepper, lemon juice, oil, paprika, oregano, and salt
2. Score chicken deeply and rub marinade all over
3. Marinate for at least 4 hours (overnight is best)
4. Preheat grill to medium-high
5. Grill chicken skin-side down for 15 minutes
6. Flip and grill for another 20-25 minutes
7. Baste with remaining marinade while cooking
8. Rest for 10 minutes before serving

Serve with chips and a fresh salad!`,
      imageUrl: 'https://cdn.pixabay.com/photo/2017/06/29/20/09/peri-peri-chicken-2455037_1280.jpg',
      prepTime: 15,
      cookTime: 40,
      servings: 4,
      published: true,
    },
    {
      title: 'Bunny Chow',
      description: 'South African street food classic - a hollowed-out loaf of bread filled with aromatic curry. Originally from Durban\'s Indian community.',
      instructions: `# Bunny Chow

## Ingredients
- 4 small bread loaves (unsliced)
- 500g lamb or chicken, cubed
- 2 onions, diced
- 3 tomatoes, chopped
- 3 tbsp curry powder
- 1 tbsp garam masala
- 2 potatoes, cubed
- 2 carrots, diced
- 2 cups chicken stock
- 3 cloves garlic, minced
- 1 inch ginger, grated
- Fresh coriander
- Oil for cooking

## Instructions
1. Heat oil, fry onions until golden
2. Add garlic, ginger, curry powder, garam masala
3. Add meat, brown on all sides
4. Add tomatoes, cook until soft
5. Add potatoes, carrots, and stock
6. Simmer for 45 minutes until meat is tender
7. Cut top off each loaf, hollow out the inside
8. Fill with hot curry
9. Garnish with coriander
10. Serve with the bread "lid" on top

Eat with your hands for the authentic experience!`,
      imageUrl: 'https://cdn.pixabay.com/photo/2019/02/14/07/21/bunny-chow-3996394_1280.jpg',
      prepTime: 20,
      cookTime: 60,
      servings: 4,
      published: true,
    },
    {
      title: 'Doro Wat (Ethiopian Chicken Stew)',
      description: 'Ethiopia\'s national dish - a rich, spicy chicken stew with hard-boiled eggs. Traditionally served on injera flatbread.',
      instructions: `# Doro Wat - Ethiopian Chicken Stew

## Ingredients
- 1.5kg chicken pieces
- 4 onions, finely chopped
- 1/4 cup berbere spice mix
- 3 tbsp niter kibbeh (Ethiopian spiced butter) or regular butter
- 4 cloves garlic, minced
- 1 inch ginger, grated
- 2 tbsp tomato paste
- 2 cups chicken stock
- 6 hard-boiled eggs, peeled
- Juice of 1 lemon
- Salt to taste

## Instructions
1. Dry-roast onions in a large pot until caramelized (20 minutes)
2. Add niter kibbeh, berbere, garlic, and ginger
3. Cook for 5 minutes, stirring constantly
4. Add tomato paste and stock
5. Add chicken pieces, coat well with sauce
6. Simmer covered for 45 minutes
7. Add hard-boiled eggs, cook for 10 more minutes
8. Add lemon juice before serving
9. Serve with injera or rice

A deeply flavorful and aromatic dish!`,
      imageUrl: 'https://cdn.pixabay.com/photo/2018/04/05/14/09/doro-wat-3293524_1280.jpg',
      prepTime: 30,
      cookTime: 75,
      servings: 6,
      published: true,
    },
    {
      title: 'Ndolé (Cameroonian Bitterleaf Stew)',
      description: 'Cameroon\'s national dish - a rich stew made with bitterleaf, peanuts, and meat or fish. Aromatic and deeply flavorful.',
      instructions: `# Ndolé - Cameroonian National Dish

## Ingredients
- 500g ndolé (bitterleaf), washed and boiled
- 500g beef or fish, cubed
- 200g shrimp (optional)
- 1 cup roasted peanuts, ground
- 2 onions, chopped
- 4 cloves garlic, minced
- 2 tbsp crayfish powder
- 2 tbsp palm oil
- 2 Maggi cubes
- 1 scotch bonnet pepper
- Salt to taste

## Instructions
1. Boil bitterleaf 3 times to reduce bitterness, squeeze dry
2. Season and cook meat until tender
3. In a pot, heat palm oil and sauté onions and garlic
4. Add ground peanuts and crayfish powder, stir well
5. Add cooked meat and stock, simmer for 10 minutes
6. Add bitterleaf, mix thoroughly
7. Add shrimp and pepper, cook for 5 more minutes
8. Adjust seasoning and serve hot

Perfect with plantains, rice, or fufu!`,
      imageUrl: 'https://verodav-shop.com/wp-content/uploads/2023/06/sddefault.jpg',
      prepTime: 40,
      cookTime: 60,
      servings: 6,
      published: true,
    },
    {
      title: 'Poulet DG (Directeur Général Chicken)',
      description: 'Luxurious Cameroonian chicken dish with plantains and vegetables. Named after high-ranking officials who could afford it.',
      instructions: `# Poulet DG - Director General's Chicken

## Ingredients
- 1kg chicken pieces
- 4 ripe plantains, sliced diagonally
- 2 bell peppers (red and green), sliced
- 2 carrots, julienned
- 1 onion, sliced
- 4 cloves garlic, minced
- 1 inch ginger, grated
- 2 Maggi cubes
- 1/4 cup vegetable oil
- 1 tbsp tomato paste
- 1 tsp curry powder
- Salt and pepper
- Fresh parsley

## Instructions
1. Season chicken with salt, pepper, curry, garlic, and ginger
2. Fry plantains until golden, set aside
3. Fry chicken pieces until browned, set aside
4. In same pan, sauté onions and bell peppers
5. Add tomato paste and Maggi cubes
6. Return chicken to pan, add a little water
7. Simmer for 15 minutes until chicken is cooked
8. Add fried plantains and carrots
9. Garnish with parsley and serve

A celebration dish!`,
      imageUrl: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=800&h=600&fit=crop',
      prepTime: 25,
      cookTime: 35,
      servings: 4,
      published: true,
    },
    {
      title: 'Eru (Cameroonian Vegetable Soup)',
      description: 'Traditional Cameroonian soup made with eru leaves, waterleaf, and palm oil. Nutritious and comforting.',
      instructions: `# Eru - Traditional Cameroonian Soup

## Ingredients
- 300g eru (okok) leaves, finely shredded
- 200g waterleaf, chopped
- 500g beef or smoked fish
- 1/4 cup palm oil
- 2 onions, chopped
- 3 tbsp crayfish, ground
- 2 Maggi cubes
- 1 scotch bonnet pepper
- Salt to taste

## Instructions
1. Cook meat with onions and Maggi until tender
2. Add eru leaves to the pot, stir well
3. Add palm oil and crayfish, mix thoroughly
4. Add waterleaf and pepper
5. Simmer on low heat for 20 minutes, stirring occasionally
6. Add more water if too thick
7. Adjust seasoning
8. Serve with fufu, garri, or rice

A healthy and delicious traditional meal!`,
      imageUrl: 'https://www.africanbites.com/wp-content/uploads/2019/11/Eru-Soup-Spinach-or-Okazi-Leaves-6.jpg',
      prepTime: 30,
      cookTime: 45,
      servings: 6,
      published: true,
    },
    {
      title: 'Koki (Cameroonian Bean Pudding)',
      description: 'Steamed black-eyed pea pudding wrapped in banana leaves. A protein-rich traditional delicacy.',
      instructions: `# Koki - Cameroonian Bean Pudding

## Ingredients
- 500g black-eyed peas, soaked overnight
- 1/4 cup palm oil
- 1 onion, chopped
- 2 scotch bonnet peppers
- 2 Maggi cubes
- 1 tsp salt
- Banana leaves for wrapping
- Water as needed

## Instructions
1. Peel soaked beans by rubbing between palms
2. Blend beans with onion, pepper, and a little water until smooth
3. Add palm oil, Maggi, and salt to the paste
4. Mix thoroughly until well combined
5. Cut banana leaves into squares, soften over flame
6. Scoop paste onto leaves, wrap into parcels
7. Arrange in a steamer pot
8. Steam for 45-60 minutes until firm
9. Unwrap and serve hot or cold

Delicious with fried plantains!`,
      imageUrl: 'https://www.africanbites.com/wp-content/uploads/2014/08/Koki-Beans-11.jpg',
      prepTime: 50,
      cookTime: 60,
      servings: 8,
      published: true,
    },
    {
      title: 'Achu Soup (Yellow Soup)',
      description: 'Rich yellow soup from Northwest Cameroon made with limestone and palm oil. Traditionally served with pounded cocoyam.',
      instructions: `# Achu Soup - Yellow Soup

## Ingredients
- 1kg beef or cow skin
- 1/4 cup palm oil
- 2 tbsp kanwa (limestone water)
- 3 onions, chopped
- 4 cloves garlic
- 2 tbsp crayfish, ground
- 2 Maggi cubes
- 1 scotch bonnet pepper
- 2 cups water
- Salt to taste

## Instructions
1. Cook meat with onions, garlic, and Maggi until very tender
2. Remove meat, reserve stock
3. In a bowl, mix palm oil with kanwa until it turns yellow
4. Add the yellow mixture to the meat stock
5. Add crayfish and pepper
6. Simmer for 15 minutes, stirring constantly
7. Return meat to soup
8. Adjust consistency with water
9. Serve with achu (pounded cocoyam)

A unique and traditional delicacy!`,
      imageUrl: 'https://images.squarespace-cdn.com/content/v1/5e04d1c138bd0a5d714cea2b/1701993920899-R2Y8TYQI1GE355DF3ZUW/20231207_122332.jpg',
      prepTime: 20,
      cookTime: 90,
      servings: 6,
      published: true,
    },
    {
      title: 'Sangah (Cameroonian Corn Fufu)',
      description: 'Corn-based fufu mixed with cassava leaves. A staple from the Northwest region of Cameroon.',
      instructions: `# Sangah - Corn Fufu with Cassava Leaves

## Ingredients
- 3 cups corn flour
- 500g cassava leaves, finely chopped
- 1/4 cup palm oil
- 1 onion, chopped
- 2 Maggi cubes
- 1 tsp salt
- 6 cups water

## Instructions
1. Boil cassava leaves with onion and Maggi for 30 minutes
2. Add palm oil and salt, cook for 10 more minutes
3. Gradually add corn flour while stirring vigorously
4. Keep stirring to prevent lumps
5. Cook on low heat for 15 minutes, stirring constantly
6. The mixture should be thick and smooth
7. Mold into balls and serve hot

Serve with njama njama soup or eru!`,
      imageUrl: ' https://media.licdn.com/dms/image/v2/C5622AQEadyitQ4jcVg/feedshare-shrink_2048_1536/feedshare-shrink_2048_1536/0/1677943560527?e=2147483647&v=beta&t=RnArPtdRwdGJuOkLcaN2h2VKUtOTwyot3P2hz4HXAPo',
      prepTime: 15,
      cookTime: 55,
      servings: 6,
      published: true,
    },
    {
      title: 'Mbongo Tchobi (Black Stew)',
      description: 'Aromatic black stew from Littoral region made with special spices and burnt herbs. Intensely flavorful.',
      instructions: `# Mbongo Tchobi - Black Stew

## Ingredients
- 1kg fish or meat
- 4 mbongo sticks (burnt spice sticks)
- 2 onions, chopped
- 4 cloves garlic
- 1 inch ginger
- 2 tbsp njangsa (African nutmeg)
- 1 tbsp country onion
- 2 Maggi cubes
- 2 tbsp palm oil
- 1 scotch bonnet pepper
- Salt to taste

## Instructions
1. Burn mbongo sticks until charred, soak in water
2. Blend burnt sticks with onions, garlic, ginger, njangsa
3. Season fish/meat and set aside
4. Heat palm oil, add the black spice paste
5. Fry for 10 minutes, stirring constantly
6. Add water to make a sauce
7. Add fish/meat and Maggi cubes
8. Simmer for 30 minutes until cooked
9. Add pepper and adjust seasoning

Serve with plantains, rice, or fufu!`,
      imageUrl: 'https://i.ytimg.com/vi/XEJjbAk5Ce4/maxresdefault.jpg',
      prepTime: 30,
      cookTime: 45,
      servings: 6,
      published: true,
    },
    {
      title: 'Kwacoco (Cocoyam Porridge)',
      description: 'Creamy cocoyam porridge with palm oil and spices. Comfort food from the Southwest region.',
      instructions: `# Kwacoco - Cocoyam Porridge

## Ingredients
- 1kg cocoyam, peeled and cubed
- 1/4 cup palm oil
- 2 onions, chopped
- 3 tbsp crayfish, ground
- 2 Maggi cubes
- 1 scotch bonnet pepper, chopped
- 2 cups water
- Salt to taste
- Fresh basil leaves

## Instructions
1. Boil cocoyam until very soft (about 40 minutes)
2. Mash cocoyam while still hot
3. Add palm oil and mix well
4. Add onions, crayfish, Maggi, and pepper
5. Add water gradually while stirring
6. Cook on low heat for 15 minutes
7. Stir frequently to prevent sticking
8. Garnish with basil leaves

Creamy, filling, and delicious!`,
      imageUrl: 'https://i.ytimg.com/vi/Ho62d9ydXt8/hqdefault.jpg',
      prepTime: 15,
      cookTime: 55,
      servings: 6,
      published: true,
    },
    {
      title: 'Kondre (Cameroonian Plantain Porridge)',
      description: 'Savory plantain porridge cooked with palm oil, meat, and spices. A hearty one-pot meal.',
      instructions: `# Kondre - Plantain Porridge

## Ingredients
- 6 ripe plantains, peeled and cubed
- 500g beef or fish
- 1/4 cup palm oil
- 2 onions, chopped
- 3 tomatoes, chopped
- 2 tbsp crayfish
- 2 Maggi cubes
- 1 scotch bonnet pepper
- 3 cups water
- Salt to taste

## Instructions
1. Season and cook meat until tender
2. Add palm oil, onions, and tomatoes to the pot
3. Fry for 5 minutes
4. Add plantains and water
5. Add crayfish, Maggi, pepper, and salt
6. Cook on medium heat for 25 minutes
7. Mash some plantains to thicken the porridge
8. Stir gently and cook for 5 more minutes

A complete meal in one pot!`,
      imageUrl: 'https://images.unsplash.com/photo-1587334206607-9e9a2c8e4b7e?w=800&h=600&fit=crop',
      prepTime: 20,
      cookTime: 45,
      servings: 6,
      published: true,
    },
    {
      title: 'Puff Puff (Cameroonian Donuts)',
      description: 'Sweet, fluffy deep-fried dough balls. Popular street snack and breakfast treat across Cameroon.',
      instructions: `# Puff Puff - Cameroonian Donuts

## Ingredients
- 3 cups all-purpose flour
- 1/2 cup sugar
- 2 tsp instant yeast
- 1/2 tsp salt
- 1/2 tsp nutmeg
- 1 tsp vanilla extract
- 2 cups warm water
- Vegetable oil for frying

## Instructions
1. Mix flour, sugar, yeast, salt, and nutmeg in a bowl
2. Add vanilla and warm water gradually
3. Mix until smooth and slightly thick
4. Cover and let rise for 1-2 hours until doubled
5. Heat oil in a deep pot to 350°F (175°C)
6. Scoop batter with wet hands or spoon
7. Drop into hot oil, fry until golden brown
8. Turn occasionally for even cooking
9. Drain on paper towels
10. Serve warm, optionally dust with powdered sugar

Perfect with tea or coffee!`,
      imageUrl: 'https://www.preciouscore.com/wp-content/uploads/2016/11/How-To-Make-Puff-Puff-1067x1536.jpg',
      prepTime: 15,
      cookTime: 30,
      servings: 20,
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

  console.log('✅ Seeding complete! Added 16 delicious African recipes (6 Pan-African + 10 Cameroonian dishes).')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
