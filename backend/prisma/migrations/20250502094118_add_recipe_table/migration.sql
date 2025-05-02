-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "emoji" TEXT,
    "type" TEXT,
    "origin" TEXT,
    "time" TEXT,
    "difficulty" TEXT,
    "spiceLevel" TEXT,
    "diet" TEXT,
    "protein" INTEGER,
    "carbohydrates" INTEGER,
    "fat" INTEGER,
    "calories" INTEGER,
    "serves" INTEGER,
    "creatorInsights" TEXT,
    "substitutions" TEXT,
    "background" TEXT,
    "equipment" TEXT,
    "storage" TEXT,
    "didYouKnow" TEXT,
    "importId" TEXT NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeHighlight" (
    "id" TEXT NOT NULL,
    "highlight" TEXT NOT NULL,
    "recipeId" TEXT,

    CONSTRAINT "RecipeHighlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeQuickTip" (
    "id" TEXT NOT NULL,
    "quickTip" TEXT NOT NULL,
    "recipeId" TEXT,

    CONSTRAINT "RecipeQuickTip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeIngredient" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "recipeId" TEXT,

    CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeTip" (
    "id" TEXT NOT NULL,
    "tip" TEXT NOT NULL,
    "recipeId" TEXT,

    CONSTRAINT "RecipeTip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeServingSuggestion" (
    "id" TEXT NOT NULL,
    "servingSuggestion" TEXT NOT NULL,
    "recipeId" TEXT,

    CONSTRAINT "RecipeServingSuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecipeStep" (
    "id" TEXT NOT NULL,
    "step" TEXT NOT NULL,
    "recipeId" TEXT,

    CONSTRAINT "RecipeStep_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_importId_fkey" FOREIGN KEY ("importId") REFERENCES "Import"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeHighlight" ADD CONSTRAINT "RecipeHighlight_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeQuickTip" ADD CONSTRAINT "RecipeQuickTip_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeTip" ADD CONSTRAINT "RecipeTip_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeServingSuggestion" ADD CONSTRAINT "RecipeServingSuggestion_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecipeStep" ADD CONSTRAINT "RecipeStep_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE SET NULL ON UPDATE CASCADE;
