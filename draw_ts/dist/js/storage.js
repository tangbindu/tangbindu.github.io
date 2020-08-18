let storage = {
    //stage
    stage: {},
    //sprites
    sprites: [],
    saveStage(stage) {
        this.stage = {};
        this.sprites = [];
        //save stage
        for (let name in stage) {
            if (typeof stage[name] != "object") {
                this.stage[name] = stage[name];
                this.stage.x = 0;
                this.stage.y = 0;
                this.stage.scale = 1;
            }
        }
        //sage sprite
        stage.spritesController.sprites.forEach(sprite => {
            if (sprite.type != "app_assist") {
                let spriteConfig = {};
                for (let proName in sprite) {
                    if (typeof sprite[proName] != "object") {
                        if (proName == "imagePath" && (sprite[proName].length > 200)) {
                            //不存了
                            spriteConfig[proName] = "#";
                        }
                        else {
                            spriteConfig[proName] = sprite[proName];
                        }
                    }
                }
                this.sprites.push(spriteConfig);
            }
        });
        localStorage.setItem('stage', JSON.stringify(this.stage));
        localStorage.setItem('sprites', JSON.stringify(this.sprites));
    },
    getStage() {
        return {
            stage: JSON.parse(localStorage.getItem('stage')) || {},
            sprites: JSON.parse(localStorage.getItem('sprites')) || [],
        };
    }
};
export default storage;
//# sourceMappingURL=storage.js.map