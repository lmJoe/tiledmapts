(function () {
    'use strict';

    var Scene = Laya.Scene;
    var REG = Laya.ClassUtils.regClass;
    var ui;
    (function (ui) {
        var test;
        (function (test) {
            class TestSceneUI extends Scene {
                constructor() { super(); }
                createChildren() {
                    super.createChildren();
                    this.createView(TestSceneUI.uiView);
                }
            }
            TestSceneUI.uiView = { "type": "Scene", "props": { "width": 640, "runtime": "script/GameUI.ts", "name": "gameBox", "height": 1136 }, "compId": 1, "loadList": [], "loadList3D": [] };
            test.TestSceneUI = TestSceneUI;
            REG("ui.test.TestSceneUI", TestSceneUI);
        })(test = ui.test || (ui.test = {}));
    })(ui || (ui = {}));

    class GameUI extends ui.test.TestSceneUI {
        constructor() {
            super();
            this.mX = 24;
            this.mY = 16;
            Laya.MouseManager.multiTouchEnabled = false;
            this.tMap = new Laya.TiledMap();
            var viewRect = new Laya.Rectangle(0, 0, Laya.stage.width, Laya.stage.height);
            this.tMap.createMap("./map/layaboxdemo.json", viewRect, Laya.Handler.create(this, this.onMapLoaded));
        }
        onEnable() {
        }
        onMapLoaded() {
            this.pass = this.tMap.getLayerByName("road");
            this.player = this.tMap.getLayerByName("player");
            this.player1 = this.player.getObjectDataByName("player1");
            this.tMap.setViewPortPivotByScale(0, 0);
            this.tMap.scale = 1.7;
            Laya.stage.on(Laya.Event.KEY_DOWN, this, this.onkeydown);
        }
        onkeydown(e) {
            switch (e["keyCode"]) {
                case 38: {
                    if ((this.player1.y - 16) <= 0) {
                        this.player1.y = 0;
                    }
                    else {
                        debugger;
                        var a = this.pass.getTileData((this.player1.x) / 16, ((this.player1.y) - 16) / 16);
                        var b = this.tMap.getTileProperties(1, a - 1, "isCanPass");
                        console.log("getTileDataByScreenPos:" + a);
                        if (b) {
                            this.player.y -= 16;
                        }
                    }
                    break;
                }
                case 39: {
                    var a = this.pass.getTileData((this.player1.x + this.mX + 16) / 16, (this.player1.y + this.mY) / 16);
                    var b = this.tMap.getTileProperties(1, a - 1, "isCanPass");
                    console.log("getTileDataByScreenPos:" + a);
                    if (!b) {
                        if (this.player1.x > 500) {
                            if (this.mX > 3184) {
                                if (this.player1.x < 1088) {
                                    this.player1.x += 16;
                                }
                            }
                            else {
                                this.mX += 16;
                                this.tMap.moveViewPort(this.mX, this.mY);
                            }
                        }
                        else {
                            this.player1.x += 16;
                        }
                    }
                    break;
                }
            }
        }
    }

    class GameConfig {
        constructor() { }
        static init() {
            var reg = Laya.ClassUtils.regClass;
            reg("script/GameUI.ts", GameUI);
        }
    }
    GameConfig.width = 640;
    GameConfig.height = 1136;
    GameConfig.scaleMode = "fixedwidth";
    GameConfig.screenMode = "none";
    GameConfig.alignV = "top";
    GameConfig.alignH = "left";
    GameConfig.startScene = "test/TestScene.scene";
    GameConfig.sceneRoot = "";
    GameConfig.debug = false;
    GameConfig.stat = false;
    GameConfig.physicsDebug = false;
    GameConfig.exportSceneToJson = true;
    GameConfig.init();

    class Main {
        constructor() {
            if (window["Laya3D"])
                Laya3D.init(GameConfig.width, GameConfig.height);
            else
                Laya.init(GameConfig.width, GameConfig.height, Laya["WebGL"]);
            Laya["Physics"] && Laya["Physics"].enable();
            Laya["DebugPanel"] && Laya["DebugPanel"].enable();
            Laya.stage.scaleMode = GameConfig.scaleMode;
            Laya.stage.screenMode = GameConfig.screenMode;
            Laya.stage.alignV = GameConfig.alignV;
            Laya.stage.alignH = GameConfig.alignH;
            Laya.URL.exportSceneToJson = GameConfig.exportSceneToJson;
            if (GameConfig.debug || Laya.Utils.getQueryString("debug") == "true")
                Laya.enableDebugPanel();
            if (GameConfig.physicsDebug && Laya["PhysicsDebugDraw"])
                Laya["PhysicsDebugDraw"].enable();
            if (GameConfig.stat)
                Laya.Stat.show();
            Laya.alertGlobalError(true);
            Laya.ResourceVersion.enable("version.json", Laya.Handler.create(this, this.onVersionLoaded), Laya.ResourceVersion.FILENAME_VERSION);
        }
        onVersionLoaded() {
            Laya.AtlasInfoManager.enable("fileconfig.json", Laya.Handler.create(this, this.onConfigLoaded));
        }
        onConfigLoaded() {
            GameConfig.startScene && Laya.Scene.open(GameConfig.startScene);
        }
    }
    new Main();

}());
