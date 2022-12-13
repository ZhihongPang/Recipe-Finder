import sys
import json
import random
import traceback
import string
# recipes database should reside in ../src/recipes.json
# in the future, we could opt in to use a sql database for a more efficient implementation

# to use this API
# python search.py "ingredient 1, ingredient 2, ..., ingredient n"
# this will print out a list of recipes matching ALL of the given ingredients 

# alternate use
# python search.py
# just calling the backend API without giving an ingredient to it will result in a random recipe being printed
class Recipe:
    def __init__(self, id:int, image:str, name:str, description:str, ingredients:dict, instructions:list) -> None:
        self.id = id 
        self.image = image
        self.name = name
        self.description = description
        self.ingredients = ingredients # dictionary where key=ingredient name and value=quantity
        self.instructions = instructions # list of instruction steps
    
    def __str__(self) -> str:
        ingredients = "<ul>"
        instructions = ""
        counter = 1
        for ingredient in self.ingredients.keys():
            ingredients += f"<li>{ingredient}: {self.ingredients[ingredient]}</li>"
        ingredient += "</ul>"
        for instruction in self.instructions:
            instructions += f"<li><b>Step {counter}:</b></li><p>{instruction}</p>"
            counter += 1

        return f"""
            <div class="img-wrapper">
            <img src='{self.image}'>
            <h1 align='center'>{self.name}</h1></div>
            <button id='return' type='submit' onclick='home()' style='position:fixed; top:10px; right:9px;'>Back</button>
            <div><p style='padding-top:20px;'>{self.description}</p></div>
            <h3><b>Ingredients: </b></h3><br><p>{ingredients}</p>
            <h3><b>Instructions: </b></h3><br><p>{instructions}</p>
            """

class Find:
    def __init__(self) -> None:
        self.all_recipes = {}
        with open(f"..\\src\\recipes.json", "r") as recipes:
            all_recipes = json.load(recipes)["recipes"]
            for recipe in all_recipes.keys():
                self.all_recipes[recipe] = Recipe(
                    id=all_recipes[recipe]["id"],
                    image=all_recipes[recipe]["link"],
                    name=recipe.title(),
                    description=all_recipes[recipe]["description"],
                    ingredients=all_recipes[recipe]["ingredients"],
                    instructions=all_recipes[recipe]["instructions"]
                )
        
        # prints a random recipe
        if len(sys.argv) < 2:
            self.get_random_recipe()

        # get recipes by ingredients string
        if len(sys.argv) == 2:
            ingredients = sys.argv[1] # crops out the file name, ingredients is a comma separated string containing all of the required ingredients
            formatting = ingredients.split(", ")
            self.desired_ingredients = [x.strip().lower() for x in formatting]
            self.get_all_by_ingredients()
        

    def __str__(self) -> str: # print all recipes extracted from the json file
        for recipe in self.all_recipes.keys():
            print(self.all_recipes[recipe])
        return ""

    # deprecated function, it is only capable of returning 1 recipe, use get_all_by_ingredients instead
    def get_recipe_by_ingredients(self):
        try:
            for recipe in self.all_recipes.keys():
                if all(ingredient in self.all_recipes[recipe].ingredients for ingredient in self.desired_ingredients):
                    output = str(self.all_recipes[recipe])
                    print(output.replace('\n', '<br>'))
            print("<pre id='boxex'>No recipe found.</pre>")        
        except:
            print("<pre id='boxex'>Failed to find recipe.</pre>")
    
    # turns a list of recipes found into square buttons with image attached
    def buttonfy_recipes(self, recipes:list):
        if recipes == []:
            return
        overlay = """
                <br><div id='boxes'>
            """
        for count, recipe in enumerate(recipes):
            # the hidden div tag contains the entirety of the individual recipe's html rendering
            overlay += f"""
                <div id='button{count}'  hidden> {str(recipe)}</div>
                <button id='display' class='display{count}' type='submit' onclick="display{count}()"> <img src="{recipe.image}" alt="recipe" class="image"> 
                <div class="overlay">
                <div class="text">{recipe.name}</div></div></button>
            """
        overlay += "</div></html>"
        print(overlay.replace("\n", '').replace("<br>", "")) # sends it to js for rendering
        return

    # special function for rendering up to three recipes
    def get_all_by_ingredients(self):
        try:
            recipes = []
            randomized_keys = list(self.all_recipes.keys())
            random.shuffle(randomized_keys)
            for recipe in randomized_keys:
                if all(ingredient in self.all_recipes[recipe].ingredients for ingredient in self.desired_ingredients):
                    recipes.append(self.all_recipes[recipe])
                    if len(recipes) >= 6: # determines how many search results are returned
                        self.buttonfy_recipes(recipes)
                        return
            if recipes != []:
                self.buttonfy_recipes(recipes)
                return
            if recipes == []:
                print("<pre id='boxes'>No recipe found.</pre>")        
        except Exception as e:
            print(f"<pre id='boxes'>Failed to find recipe. {e}</pre>")
    
    # will pass a list of one recipe to buttonfy
    def get_random_recipe(self):
        recipes = []
        recipes.append(random.choice(list(self.all_recipes.values())))
        self.buttonfy_recipes(recipes)
        
if __name__ == "__main__":
    app = Find()
