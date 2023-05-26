import { ui } from "./../ui/layaMaxUI";
/**
 * 本示例采用非脚本的方式实现，而使用继承页面基类，实现页面逻辑。在IDE里面设置场景的Runtime属性即可和场景进行关联
 * 相比脚本方式，继承式页面类，可以直接使用页面定义的属性（通过IDE内var属性定义），比如this.tipLbll，this.scoreLbl，具有代码提示效果
 * 建议：如果是页面级的逻辑，需要频繁访问页面内多个元素，使用继承式写法，如果是独立小模块，功能单一，建议用脚本方式实现，比如子弹脚本。
 */
export default class GameUI extends ui.test.TestSceneUI {
    private tMap: Laya.TiledMap;
    private pass: Laya.MapLayer;
    private player: Laya.MapLayer;
    private player1: Laya.MapLayer;
    private mX: number = 24;
    private mY: number = 16;
  
    


    constructor() {
        super();
        //关闭多点触控，否则就无敌了
        Laya.MouseManager.multiTouchEnabled = false;
        //创建TiledMap实例
        this.tMap = new Laya.TiledMap();
        //创建Rectangle实例，视口区域
        var viewRect:Laya.Rectangle = new Laya.Rectangle(0,0,Laya.stage.width,Laya.stage.height);
        //创建TiledMap地图
        this.tMap.createMap("./map/layaboxdemo.json",viewRect,Laya.Handler.create(this,this.onMapLoaded));
    }

    onEnable(): void {
      
    }
    private onMapLoaded():void{
      this.pass = this.tMap.getLayerByName("road");
      // this.pass = this.tMap.getLayerByIndex(1);
      //获取人物图层
      this.player = this.tMap.getLayerByName("player");
      this.player1 = this.player.getObjectDataByName("player1");
      //设置缩放中心点为视口的左上角
      this.tMap.setViewPortPivotByScale(0,0);
      //将原地图放大2倍
      this.tMap.scale = 1.7;
      //添加键盘按下事件,一直按着某按键则会不断触发
      Laya.stage.on(Laya.Event.KEY_DOWN,this,this.onkeydown);
  }
  private onkeydown(e:Event):void{
    switch(e["keyCode"]){
        case 38:{
          if((this.player1.y - 16) <= 0) {
              this.player1.y = 0;
          }else{
            debugger
            //var a:number = this.pass.getTileDataByScreenPos(this.player.x,this.player.y-32);
            //TiledMap中的坐标是以左上角为原点，右边是x周，下边为y轴，但是在获取对象在地图中的坐标的时候，会自动转成以左下角为原点的坐标系
            var a:number = this.pass.getTileData((this.player1.x)/16,((this.player1.y)-16)/16);//对应的格子数据
            // var d:boolean = this.pass.getLayerProperties("isCanPass");
            var b:boolean = this.tMap.getTileProperties(1,a-1,"isCanPass");//json中data的ID要和TileProperties对应，否则就是没有导入图块 可以直接修改文件
            console.log("getTileDataByScreenPos:"+a);
            if(b){this.player.y -= 16;}
          }
          break;
        }
        case 39:{
            var a:number = this.pass.getTileData((this.player1.x+this.mX+16)/16,(this.player1.y+this.mY)/16);
            var b:boolean = this.tMap.getTileProperties(1,a-1,"isCanPass");
            console.log("getTileDataByScreenPos:"+a);
            if(!b){
                if (this.player1.x > 500) {
                    //地图长度-屏幕长度 4320-1136
                    if (this.mX > 3184) {
                        //地图已经移动到终点了
                        if (this.player1.x < 1088) {
                            this.player1.x += 16;
                        }
                    }else{
                        this.mX += 16;
                        this.tMap.moveViewPort(this.mX,this.mY);
                    }
                }else{
                    this.player1.x += 16;
                }
            }
            break;
        }
    }
  }


}