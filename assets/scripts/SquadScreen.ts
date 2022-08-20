const {ccclass, property} = cc._decorator;
import { Colu, R_STATEMAP } from "./colu";
import { geth, getw, Log, drawCurvedTopBg, TimerRound, setOrderChildrenZIndex } from "./common";
import { Game, GAME_MAP } from "./Game";

@ccclass
export default class SquadScreen extends cc.Component {
    @property
    height:number = 0;
    @property
    width:number = 0;

    @property(cc.SpriteFrame)
    titleIconSpriteOp: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    titleIconSpriteMy: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    titleIconSpriteOpPressed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    titleIconSpriteMyPressed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    titleButtonSpriteMy: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    titleButtonSpriteOp: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    greyBgSpriteFrame: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    titleButtonSpriteMyPressed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    titleButtonSpriteOpPressed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    listBgPixel: cc.SpriteFrame = null;

    // @property
    // buttonSquadConfirmText:string = "";

    @property(cc.SpriteFrame)
    buttonSquadConfirmTextureNormal: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    buttonSquadConfirmTexturePressed: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    buttonSquadConfirmTextureDisabled: cc.SpriteFrame = null;

    @property
    updateTimerThreshold: number = 0.5;

    @property(cc.SpriteFrame)
    timerBg: cc.SpriteFrame = null;

    titleLabel: cc.Label = null;
    titleImage: cc.Sprite = null;
    titleButton: cc.Button = null;
    scrollview:cc.ScrollView = null;
    scrollviewContent:cc.Node = null;
    buttonSquadConfirm:cc.Button = null;
    squadConfirmTimer: TimerRound = null;

    textTitle:string;
    textTitleButton:string;

    showMyTeam:boolean=true;


    
    // onLoad () {}

    start () {
        Log.logToConsole = true;
        this.initui();
        this.onResized();
        
        if (cc.sys.isMobile) {
            window.addEventListener('resize', this.onResized.bind(this));
        } else {
            cc.view.on('canvas-resize', this.onResized, this);
        }
    }

    cumulativeTimer=0;
    gameScreenOpened = false;
    update (dt) {
        if(this.gameScreenOpened) return;
        this.cumulativeTimer+=dt;
        if(this.cumulativeTimer>= this.updateTimerThreshold){
            //also check for game status
            this.cumulativeTimer=0;
            if(Game.status > GAME_MAP.TEAM_SELECTION_COMPLETE && Game.turn.id>=0) {
                //toss data has been received, navigate
                cc.director.loadScene("GameScene");
                this.gameScreenOpened = true;
            }
        }

    }

    initui() {
        this.titleLabel = this.node.getChildByName('title').getComponent(cc.Label);
        this.titleImage = this.node.getChildByName('labelImage').getComponent(cc.Sprite);
        this.titleButton = this.node.getChildByName('btnSwitchView').getComponent(cc.Button);
        this.scrollview = this.node.getChildByName('scrollview').getComponent(cc.ScrollView);
        // this.scrollviewContent = this.scrollview.node.getChildByName('view');
        this.scrollviewContent = this.scrollview.node.getChildByName('view').getChildByName('content');

        //set click listener for titleButton
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "SquadScreen";  // This is the code file name
        clickEventHandler.handler = "changeTeamView";
        clickEventHandler.customEventData = "1";
        // clickEventHandler.emit(["param1", "param2"]);
        this.titleButton.clickEvents = [clickEventHandler];
        this.buttonSquadConfirm = this.node.getChildByName('buttonSquadConfirm').getComponent(cc.Button);

        Log.v("Event listners done...")

        // Squad confirm button
        this.buttonSquadConfirm.normalSprite=this.buttonSquadConfirmTextureNormal;
        this.buttonSquadConfirm.pressedSprite=this.buttonSquadConfirmTexturePressed;
        this.buttonSquadConfirm.disabledSprite=this.buttonSquadConfirmTextureDisabled;

        // set click listener for squad confirm button      
        let bSCEventHandler = new cc.Component.EventHandler();
        bSCEventHandler.target = this.node;
        bSCEventHandler.component = "SquadScreen";  // This is the code file name
        bSCEventHandler.handler = "submitSquad";
        bSCEventHandler.customEventData = "1";
        this.buttonSquadConfirm.clickEvents = [bSCEventHandler];

        Log.v('content parent');
        Log.v(this.scrollview.node.getChildByName('view'));
    }

    buildui() {
        drawCurvedTopBg(this,5,5,this.greyBgSpriteFrame,2)
        if(this.titleLabel==null){
            Log.w("[SquadScreen] buildUi was called before initUi");
            return;
        }
        if(this.showMyTeam){
            this.textTitle = "BATTING ORDER";
            this.titleImage.getComponent(cc.Sprite).spriteFrame=(this.titleIconSpriteMy);
            this.titleButton.node.getChildByName('background').getComponent(cc.Sprite).spriteFrame=(this.titleButtonSpriteMy);
            this.titleButton.normalSprite=(this.titleButtonSpriteMy);
        }else{
            this.textTitle = "OPPONENT'S TEAM";
            this.titleImage.getComponent(cc.Sprite).spriteFrame=(this.titleIconSpriteOp);
            this.titleButton.node.getChildByName('background').getComponent(cc.Sprite).spriteFrame=(this.titleButtonSpriteOp);
            this.titleButton.normalSprite=(this.titleButtonSpriteOp);
        }
        if(this.squadConfirmTimer===null)
            this.squadConfirmTimer=new TimerRound({
                context:this,
                background:this.timerBg,
                maxTime:Game.squads.getRemainingSeconds(),
                anchorPoint:[0.5,0.5],
                position:[0,-geth(this,40.25)],
                onEnd:[this,this.submitSquad]
            })

        console.log('rebuilding '+this.node.name);        
        //place - WTF is happening? - relative placement is too confusing
        this.titleLabel.node.setPosition(getw(this,-34),geth(this,35));
        this.titleImage.node.setPosition(getw(this,-45),geth(this,35));
        this.titleButton.node.setPosition(getw(this,20),geth(this,35));
        this.scrollview.node.setPosition(getw(this,-50),geth(this,-10));
        this.scrollviewContent.parent.setPosition(getw(this,0),geth(this,0));
        this.scrollviewContent.setPosition(getw(this,0),geth(this,0));
        this.buttonSquadConfirm.node.setPosition(getw(this,50),-geth(this,50));

        //resize
        this.titleLabel.node.setContentSize(new cc.Size(getw(this,50),geth(this,10)));
        this.titleImage.node.setContentSize(new cc.Size(getw(this,8),getw(this,8)));
        this.titleButton.node.setContentSize(new cc.Size(getw(this,25),geth(this,6)));
        this.scrollview.node.setContentSize(new cc.Size(getw(this,200),geth(this,80)));
        this.scrollviewContent.parent.setContentSize(new cc.Size(getw(this,90),geth(this,80)));
        this.scrollviewContent.setContentSize(new cc.Size(getw(this,10),geth(this,2000)));

        let testSize46846:any=this.buttonSquadConfirmTextureNormal.getOriginalSize()
        testSize46846=testSize46846.width/testSize46846.height
        testSize46846=new cc.Size(getw(this,50),getw(this,50)/testSize46846)

        this.buttonSquadConfirm.node.setContentSize(testSize46846);
        // Log.v(this.scrollview);
        this.titleLabel.string = this.textTitle;
        // Log.v(this.titleButton);
        // Log.v(this.titleButton.node);
        // Log.v(this.titleButton.node.getChildByName("Background"));
        
        // this.titleButton.sp

        // Log all event listeners to confirm
        Log.v(this.titleButton.clickEvents);
        Log.v(this.buttonSquadConfirm.clickEvents)

        //set scrollview
        // this.scrollview.node.color =cc.Color.TRANSPARENT;
        if(this.showMyTeam)
            this.setMyPlayers();
        else
            this.setOpponentPlayers()
    }

    submitSquad(sender, eType) {
        Log.v("Squad confim button was clicked. Destroying squad...")
        this.squadConfirmTimer.destroy()
        delete(this.squadConfirmTimer)
        Log.v("submitting timer...")
        Game.user.submitSquad();
        this.buttonSquadConfirm.enabled=false;
        this.buttonSquadConfirm.clickEvents=[];
        this.buttonSquadConfirm.node.getChildByName('Background').getComponent(cc.Sprite).spriteFrame=this.buttonSquadConfirmTextureDisabled
    }

    setOpponentPlayers() {this.setMyPlayers(true)}

    setMyPlayers(opponent:boolean=false) {
        //create a node
        Log.v('building players');
        const h = geth(this, 6);
        const w = getw(this, 100);
        const space = geth(this,2.5);
        Log.v(this.scrollviewContent);
        Log.v(this.scrollviewContent.parent);
        const starty = geth(this, -10);
        const startx = getw(this, 10);

        Log.v("Getting players for constructing list")
        let players:Array<any> = (opponent)?Game.opponent.players:Game.user.players
        /* [{
            playerid:1,
            imageurl:'https://s.ndtvimg.com/images/entities/300/virat-kohli-967.png',
            name:'Virat Kohli',
            bat:85,
            bowl:30,
            runs:49,
            level:1
          },{
            playerid:2,
            imageurl:'https://www.pngkey.com/png/full/159-1593095_lacmta-circle-purple-line-purple-circle-transparent-background.png',
            name:'Rohit',
            bat:84,
            bowl:40,
            runs:50,
            level:2
          },{
            playerid:3,
            imageurl:'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Button_Icon_Purple.svg/1200px-Button_Icon_Purple.svg.png',
            name:'David Warner',
            bat:80,
            bowl:10,
            runs:32,
            level:3
          },{
            playerid:4,
            imageurl:'http://www.clker.com/cliparts/k/D/r/a/H/H/glossy-purple-light-3-button-md.png',
            name:'Jasprit Bumrah',
            bat:7,
            bowl:84,
            runs:3,
            level:1
          }] */
        let pCount=players.length
        Log.v(`Received ${pCount} players`)
        
        Log.v("Destroying scrollview")
        for(let someitem of this.scrollviewContent.children)
            someitem.destroy()

        Log.v("Constructing scrollview");

        for (var i:number = 0;i<pCount;i++){
            // var cNode:cc.Node = new cc.Node('lItem');
            // cNode.setAnchorPoint(0,0.5);
            // var label = cNode.addComponent(cc.Label);
            // label.string = "matchstick"+i.toString();

            // label.fontSize = 30;
            // cNode.parent = this.scrollviewContent;
            // cNode.setPosition(startx,starty-i*space);
            // cNode.setContentSize(new cc.Size(h,w));

            // Create list item
            var cNode:cc.Node = new cc.Node('lItem'+i.toString());
            cNode.setAnchorPoint(0,0.5);
            var sprite = cNode.addComponent(cc.Sprite);
            sprite.spriteFrame = this.listBgPixel;
            sprite.type=cc.Sprite.Type.FILLED
            sprite.fillType=cc.Sprite.FillType.HORIZONTAL
            sprite.fillStart=0
            sprite.fillRange=0.725      //TODO: Fix jugaad
            // cNode.color=new cc.Color(237,237,237,51)

            // Insert item into list container
            cNode.parent = this.scrollviewContent;
            cNode.setPosition(startx+(h*0.25),starty-i*(space+h));  //TODO: Fix jugaad
            cNode.setContentSize(new cc.Size(w,h));

            // Create player name
            // TODO: Fix alignment for longer names
            var lnode1:cc.Node = new cc.Node('l1');
            var label = lnode1.addComponent(cc.Label);
            label.string = players[i].name;
            label.fontSize = 15;
            label.enableWrapText = false;
            label.overflow = cc.Label.Overflow.SHRINK;
            label.horizontalAlign = cc.Label.HorizontalAlign.LEFT;

            // Add player name to list item
            lnode1.parent = cNode;
            lnode1.setAnchorPoint(0,0);
            lnode1.setPosition(60,-h/1.2);
            lnode1.setContentSize(new cc.Size(w/4,h));

            // Add runs element
            var lnode2:cc.Node = new cc.Node('l2');
            var label = lnode2.addComponent(cc.Label);
            label.string = "runs";
            label.fontSize = 10;
            label.enableWrapText = false;
            label.overflow = cc.Label.Overflow.SHRINK;
            label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;

            // Add runs element to list item
            lnode2.parent = cNode;
            lnode2.setAnchorPoint(0,0);
            lnode2.setPosition(30+w/3,-h/2.5);
            lnode2.setContentSize(new cc.Size(w/8,h/1.5));

            // Add batting element
            var lnode3:cc.Node = new cc.Node('l2');
            var label = lnode3.addComponent(cc.Label);
            label.string = "batting";
            label.fontSize = 10;
            label.enableWrapText = false;
            label.overflow = cc.Label.Overflow.SHRINK;
            label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;

            // Add runs element to list item
            lnode3.parent = cNode;
            lnode3.setAnchorPoint(0,0);
            lnode3.setPosition(30+w/3+w/8,-h/2.5);
            lnode3.setContentSize(new cc.Size(w/8,h/1.5));

            // Add bowling element
            var lnode4:cc.Node = new cc.Node('l2');
            var label = lnode4.addComponent(cc.Label);
            label.string = "bowling";
            label.fontSize = 10;
            label.enableWrapText = false;
            label.overflow = cc.Label.Overflow.SHRINK;
            label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;

            // Add bowling element to list item
            lnode4.parent = cNode;
            lnode4.setAnchorPoint(0,0);
            lnode4.setPosition(30+w/3+2*w/8,-h/2.5);
            lnode4.setContentSize(new cc.Size(w/8,h/1.5));

            // Add runs value
            var lnode5:cc.Node = new cc.Node('l2');
            var label = lnode5.addComponent(cc.Label);
            label.string = players[i].bat;
            label.fontSize = 20;
            label.enableWrapText = false;
            label.overflow = cc.Label.Overflow.SHRINK;
            label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;

            // Add runs value in place
            lnode5.parent = cNode;
            lnode5.setAnchorPoint(0,0);
            lnode5.setPosition(30+w/3,-h/1.6);
            lnode5.setContentSize(new cc.Size(w/8,h/1.5));

            // Add batting value
            var lnode6:cc.Node = new cc.Node('l2');
            var label = lnode6.addComponent(cc.Label);
            label.string = players[i].bowl;
            label.fontSize = 20;
            label.enableWrapText = false;
            label.overflow = cc.Label.Overflow.SHRINK;
            label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;

            // Add batting value in place
            lnode6.parent = cNode;
            lnode6.setAnchorPoint(0,0);
            lnode6.setPosition(30+w/3+w/8,-h/1.6);
            lnode6.setContentSize(new cc.Size(w/8,h/1.5));

            // Add bowling value
            var lnode7:cc.Node = new cc.Node('l2');
            var label = lnode7.addComponent(cc.Label);
            label.string = players[i].runs;
            label.fontSize = 20;
            label.enableWrapText = false;
            label.overflow = cc.Label.Overflow.SHRINK;
            label.horizontalAlign = cc.Label.HorizontalAlign.CENTER;

            // Add bowling value in place
            lnode7.parent = cNode;
            lnode7.setAnchorPoint(0,0);
            lnode7.setPosition(30+w/3+w/4,-h/1.6);
            lnode7.setContentSize(new cc.Size(w/8,h/1.5));

            // Add player image
            var iconName = 'icon'+i.toString();
            var lnode8:cc.Node = new cc.Node(iconName);
            SquadScreen.listIdMap[i]=([iconName, {
                name: players[i].name,
                id: players[i].playerid,
                url: players[i].imgurl
            }]);
            let pMask = lnode8.addComponent(cc.Mask)
            pMask.type=cc.Mask.Type.ELLIPSE
            pMask.segements=100
            let lnode8c=new cc.Node('pImg')
            lnode8c.setAnchorPoint(0.5,0.5)
            lnode8c.setParent(lnode8)
            var sprite2 = lnode8c.addComponent(cc.Sprite);
            sprite2.spriteFrame = this.titleIconSpriteMy;
            sprite2.sizeMode = cc.Sprite.SizeMode.CUSTOM;
            sprite2.type = cc.Sprite.Type.SIMPLE;
            sprite2.srcBlendFactor = cc.macro.BlendFactor.SRC_ALPHA;
            sprite2.dstBlendFactor = cc.macro.BlendFactor.ONE_MINUS_SRC_ALPHA;

            //tf: jugaad
            lnode8.parent = cNode;
            lnode8.setAnchorPoint(0.5,0.5);
            lnode8.setPosition(0,0);
            lnode8.setContentSize(new cc.Size(h,h));

            let lnode9:cc.Node = new cc.Node('l9')
            lnode9.setParent(this.scrollviewContent)
            lnode9.setAnchorPoint(0.5,0.5)
            lnode9.zIndex=cc.macro.MIN_ZINDEX
            lnode9.setPosition(startx+(0.75*w),starty-i*(space+h)); //TODO: Fix jugaad

            let lnode9m=lnode9.addComponent(cc.Mask)
            lnode9m.type=cc.Mask.Type.ELLIPSE
            lnode9m.segements=100
            
            let lnode9ch=new cc.Node('lnode9ch')
            let lnode9c=lnode9ch.addComponent(cc.Sprite)
            lnode9.addChild(lnode9ch)
            lnode9c.spriteFrame = this.listBgPixel;
            lnode9c.type=cc.Sprite.Type.FILLED
            lnode9c.fillType=cc.Sprite.FillType.HORIZONTAL
            lnode9c.fillStart=0
            lnode9c.fillRange=1
            lnode9.setContentSize(new cc.Size(h,h))
            lnode9ch.setContentSize(new cc.Size(h,h))

            // sprite2.spriteFrame = new cc.SpriteFrame(SquadScreen.netResMap['kohli']);
        }
        this.scrollviewContent.setContentSize(new cc.Size(getw(this,10),pCount*(space+h)+geth(this,20)));
        setOrderChildrenZIndex(this);
        Log.v('loading images');
        this.loadRes();
    }

    static listIdMap = [];
    //static netResMap = {};
    loadRes() {
        // var iconURL:string = 'https://s.ndtvimg.com/images/entities/300/virat-kohli-967.png';
        // var iconURL:string = "https://cdn.sportmonks.com/images/cricket/players/14/46.png";
        for(let playerI in SquadScreen.listIdMap)
            cc.assetManager.loadRemote<cc.Texture2D>(SquadScreen.listIdMap[playerI][1].url,{ext: '.jpg'}, (err,asset)=>{
                if(err)
                    return Log.e(`Could't load image for player ${SquadScreen.listIdMap[playerI][1].id}: ${err.message}`)
                
                Log.v(`placing image: (${SquadScreen.listIdMap[playerI][1].id}) ${SquadScreen.listIdMap[playerI][1].name}`);
                // Log.v(asset);    // Aren't we spamming the log?

                //very expensive
                this.scrollviewContent.getChildByName('lItem'+playerI.toString())
                    .getChildByName(SquadScreen.listIdMap[playerI][0])
                    .getChildByName('pImg')
                    .getComponent(cc.Sprite)
                    .spriteFrame = new cc.SpriteFrame(asset);
            });
    }

    onResized() {
        Log.v(this.node.name);
        const dsize = cc.view.getFrameSize();
        this.height = dsize.height;
        this.width = dsize.width;
        this.buildui();
        Log.v(dsize);
        //if h < w, no no no
        if(dsize.height<dsize.width){
            Log.e('Not portrait. Khelna cancel.')
            //todo: exit or message or redirect
        }
        //reload image
        var canvas:cc.Node = this.node;
        Log.v(canvas);

        // const scale = Math.max(mySize.width / deviceSize.width, mySize.height / deviceSize.height); 
        // this.node.setContentSize(deviceSize.width * scale, deviceSize.height * scale);
    }

    /**
     * Called when the titleButton is pressed to chnange the team view
     */
    changeTeamView(sender, eventType) {
        //todo: disable and re-enable the button
        Log.v("Changing squad view and rebuilding");
        this.showMyTeam = !this.showMyTeam;
        this.buildui();
    }

    onDestroy() {
        if(this.squadConfirmTimer)
            this.squadConfirmTimer.destroy()
        delete(this.squadConfirmTimer)
    }
}
