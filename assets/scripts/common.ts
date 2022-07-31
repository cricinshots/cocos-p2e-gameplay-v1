export class Log {

    static logToConsole:boolean = false;

    static v(m:any) {
        //log verbose
        this.con(m);
    }
    static w(m:any) {
        //log warn
        this.con(m);
    }
    static e(m:any) {
        //log error
        this.con(m);
    }
    static con(m:any) {
        if(this.logToConsole){
            console.log(m);
        }
    }
}

export function geth(context:any, p:number){
    return p*context.height/100;
}

export function getw(context:any,p:number){
    return p*context.width/100;
}

// Why tf is zIndex of all children 0 by default?
// This function sets the zIndex of all children based on their index
export function setOrderChildrenZIndex(context:any){
    let zIndex=0
    for(let child of context.node.children)
        child.zIndex=zIndex++
}

// This function inserts at particular child position and sets zIndex again
export function insertChildAtZIndex(context:any,position:number,...items:Array<cc.Node>){
    // First, set all zIndex-es
    setOrderChildrenZIndex(context)

    // Push zIndex-es ahead where we want to insert
    let item:any=context.node.children.length
    for(item in context.node.children)
        if(item==position)
            break
    let itemCopy=item
    for(let numPush=0; numPush<items.length; ++numPush, item=itemCopy)
        while(context.node.children[item])
            ++context.node.children[item++].zIndex

    //context.node.children.splice(position,0,...items)
    // Pushing into the children array doesn't seem to work always

    // But addChild always works
    for(let i of items)
        context.node.addChild(i,position++)

    // Reorder the children by zIndex
    context.node.children.sort(function(a,b){
        if(a.zIndex>b.zIndex) return 1
        else if(b.zIndex>a.zIndex) return -1
        else return 0
    })

    // Reset zIndex-es if children was shorter than position
    //setOrderChildrenZIndex(context)
}

export function drawCurvedTopBg(
    /*nodeTopLeftCircle:cc.Node,
    nodeTopRightCircle:cc.Node,
    nodeTopRectangle:cc.Node,
    nodeTheBigRectangle:cc.Node,*/
    context:any,
    marginTopPercent:number=5,
    curvingPercent:number=5,
    assetBgPixel:cc.SpriteFrame=null,
    pushIndex:number=context.node.children.length,
    nodeColor:cc.Color=new cc.Color(255,255,255,255)
) {
    // The absolute sizes
    let windowWidth=getw(context,100)
    let radiusCurveAbsolute=windowWidth*(curvingPercent/100)
    let windowHeight=geth(context,100)
    let marginTopAbsolute=windowHeight*(marginTopPercent/100)

    // All the sprites
    let allSprites:Array<cc.Sprite>=[]

    // Prepare the top rectangle
    let nodeTopRectangle:cc.Node
    if(nodeTopRectangle=context.node.getChildByName('topRectangle'))
        allSprites.push(nodeTopRectangle.getComponent(cc.Sprite))
    else {
        nodeTopRectangle=new cc.Node('topRectangle')
        allSprites.push(nodeTopRectangle.addComponent(cc.Sprite))
    }
    nodeTopRectangle.setAnchorPoint(0.5,1)
    nodeTopRectangle.setPosition(0,(windowHeight/2)-marginTopAbsolute)
    nodeTopRectangle.color=nodeColor

    // Prepare top left circle
    let nodeTopLeftCircle:cc.Node, maskTopLeftCircle:cc.Mask, nodeSpriteHolderTopLeftCircle:cc.Node
    if(nodeTopLeftCircle=context.node.getChildByName('topLeftCircle')) {
        maskTopLeftCircle=nodeTopLeftCircle.getComponent(cc.Mask)
        nodeSpriteHolderTopLeftCircle=nodeTopLeftCircle.getChildByName('spriteHolderTopLeftCircle')
        allSprites.push(nodeSpriteHolderTopLeftCircle.getComponent(cc.Sprite))
    }
    else {
        nodeTopLeftCircle=new cc.Node('topLeftCircle')
        maskTopLeftCircle=nodeTopLeftCircle.addComponent(cc.Mask)
        nodeSpriteHolderTopLeftCircle=new cc.Node('spriteHolderTopLeftCircle')
        nodeTopLeftCircle.addChild(nodeSpriteHolderTopLeftCircle,cc.macro.MIN_ZINDEX,'spriteHolderTopLeftCircle')
        allSprites.push(nodeSpriteHolderTopLeftCircle.addComponent(cc.Sprite))
    }
    nodeTopLeftCircle.setAnchorPoint(0.5,1)
    nodeTopLeftCircle.setPosition(-(windowWidth/2)+radiusCurveAbsolute,(windowHeight/2)-marginTopAbsolute)
    nodeTopLeftCircle.color=nodeColor
    maskTopLeftCircle.type=cc.Mask.Type.ELLIPSE
    maskTopLeftCircle.segements=100
    nodeSpriteHolderTopLeftCircle.setAnchorPoint(0.5,1)
    nodeSpriteHolderTopLeftCircle.setPosition(0,0)

    // Prepare top right circle
    let nodeTopRightCircle:cc.Node, maskTopRightCircle:cc.Mask, nodeSpriteHolderTopRightCircle:cc.Node
    if(nodeTopRightCircle=context.node.getChildByName('topRightCircle')) {
        maskTopRightCircle=nodeTopRightCircle.getComponent(cc.Mask)
        nodeSpriteHolderTopRightCircle=nodeTopRightCircle.getChildByName('spriteHolderTopRightCircle')
        allSprites.push(nodeSpriteHolderTopRightCircle.getComponent(cc.Sprite))
    }
    else {
        nodeTopRightCircle=new cc.Node('topRightCircle')
        maskTopRightCircle=nodeTopRightCircle.addComponent(cc.Mask)
        nodeSpriteHolderTopRightCircle=new cc.Node('spriteHolderTopRightCircle')
        nodeTopRightCircle.addChild(nodeSpriteHolderTopRightCircle,cc.macro.MIN_ZINDEX,'spriteHolderTopRightCircle')
        allSprites.push(nodeSpriteHolderTopRightCircle.addComponent(cc.Sprite))
    }
    nodeTopRightCircle.setAnchorPoint(0.5,1)
    nodeTopRightCircle.setPosition((windowWidth/2)-radiusCurveAbsolute,(windowHeight/2)-marginTopAbsolute)
    nodeTopRightCircle.color=nodeColor
    maskTopRightCircle.type=cc.Mask.Type.ELLIPSE
    maskTopRightCircle.segements=100
    nodeSpriteHolderTopRightCircle.setAnchorPoint(0.5,1)
    nodeSpriteHolderTopRightCircle.setPosition(0,0)

    // Prepare the big rectangle

    let nodeBigRectangle:cc.Node
    if(nodeBigRectangle=context.node.getChildByName('bigRectangle'))
        allSprites.push(nodeBigRectangle.getComponent(cc.Sprite))
    else {
        nodeBigRectangle=new cc.Node('bigRectangle')
        allSprites.push(nodeBigRectangle.addComponent(cc.Sprite))
    }
    nodeBigRectangle.setAnchorPoint(0.5,1)
    nodeBigRectangle.setPosition(0,(windowHeight/2)-(marginTopAbsolute+radiusCurveAbsolute))
    nodeBigRectangle.color=nodeColor

    // Deal with all sprites
    for(let spire of allSprites) {
        spire.spriteFrame=assetBgPixel
        spire.type=cc.Sprite.Type.FILLED
        spire.fillType=cc.Sprite.FillType.HORIZONTAL
        spire.fillStart=0
        spire.fillRange=1
        spire.sizeMode=cc.Sprite.SizeMode.RAW
        spire.srcBlendFactor=cc.macro.BlendFactor.ONE
        spire.dstBlendFactor=cc.macro.BlendFactor.ZERO
    }

    // Insert all components into context node
    insertChildAtZIndex(context,pushIndex,nodeBigRectangle,nodeTopRectangle,nodeTopLeftCircle,nodeTopRightCircle)

    // Fix all sizes broken by changing the spriteFrame
    nodeTopRectangle.setContentSize(new cc.Size(windowWidth-2*radiusCurveAbsolute,radiusCurveAbsolute))
    nodeSpriteHolderTopLeftCircle.setContentSize(new cc.Size(2*radiusCurveAbsolute,2*radiusCurveAbsolute))
    nodeTopLeftCircle.setContentSize(new cc.Size(2*radiusCurveAbsolute,2*radiusCurveAbsolute))
    nodeSpriteHolderTopRightCircle.setContentSize(new cc.Size(2*radiusCurveAbsolute,2*radiusCurveAbsolute))
    nodeTopRightCircle.setContentSize(new cc.Size(2*radiusCurveAbsolute,2*radiusCurveAbsolute))
    nodeBigRectangle.setContentSize(new cc.Size(windowWidth,windowHeight-2*radiusCurveAbsolute))
}

interface TimerRoundInterface {
    name:string,
    context:any,
    maxTime:number,
    numDigits:number,
    warnAt:number,
    autoUpdate:boolean,
    percentWidth:number,
    //percentHeight:number,
    fontSize:number,
    anchorPoint:[number,number],
    position:[number,number],
    pushIndex:number,
    background:cc.SpriteFrame,
    onEnd:[any,Function]
    /*fontAsset:cc.Font,
    spriteFrame:cc.SpriteFrame,
    ...*/
}

export class TimerRound {
    private startTime:number
    private maxTime:number
    private timerTime:number
    private numDigits:number
    private warnAt:number
    private autoUpdaterTask:number
    private nodeTimer:cc.Node
    private spriteTimer:cc.Sprite
    private richTextTimer:cc.RichText
    //private context:any
    private timerWidth:number
    private onEnd:[any,Function]
    //private timerHeight:number

    constructor({
        name='TimerRound'+Date.now(),
        context=null,
        maxTime=60,
        numDigits=(''+maxTime).length,
        warnAt=10,
        autoUpdate=true,
        percentWidth=20,
        //percentHeight=20,
        fontSize=40,
        anchorPoint=[0.5,0.5],
        position=[0,0],
        pushIndex=context.node.children.length,
        background=null,
        onEnd=[null,null]
    }:TimerRoundInterface/*={}*/) {
        // The main outer node
        this.nodeTimer=new cc.Node(name)
        this.nodeTimer.setAnchorPoint(...anchorPoint)
        this.nodeTimer.setPosition(...position)

        // Sprite component
        this.spriteTimer=this.nodeTimer.addComponent(cc.Sprite)
        this.spriteTimer.type=cc.Sprite.Type.SIMPLE
        this.spriteTimer.spriteFrame=background
        // TODO: Get a perfect square background and don't trim :-
        // this.spriteTimer.trim=true

        // RichText component
        this.richTextTimer=this.nodeTimer.addComponent(cc.RichText)
        this.richTextTimer.horizontalAlign=cc.macro.TextAlignment.CENTER
        this.richTextTimer.fontSize=fontSize
        this.richTextTimer.handleTouchEvent=false
        this.timerTime=maxTime
        this.richTextTimer.string=this.timerTime.toString()

        // Insert the timer node
        insertChildAtZIndex(context,pushIndex,this.nodeTimer)

        // Set all sizes in the end because they get reset on changing other stuff
        this.timerWidth=getw(context,percentWidth)
        //this.timerHeight=geth(context,percentHeight)
        this.resetSize()

        // Start the timer
        this.numDigits=numDigits
        this.maxTime=maxTime
        this.warnAt=warnAt
        this.onEnd=onEnd
        this.startTime=Date.now()
        // https://stackoverflow.com/questions/39812785 🤯
        if(autoUpdate)
            this.autoUpdaterTask=setInterval(this.autoUpdate,1000,this)
    }

    private getFormattedText(interval:number) {
        let intervalString=(''+interval)

        while(intervalString.length<this.numDigits)
            intervalString='0'+intervalString

        if(interval<=this.warnAt)
            return '<color=#ff0000>'+intervalString+'</color>'
        return intervalString
    }

    private resetSize() {
        this.spriteTimer.sizeMode=cc.Sprite.SizeMode.CUSTOM
        this.nodeTimer.setContentSize(this.timerWidth,/*this.timerHeight*/this.timerWidth)
        if(this.timerTime===0 && typeof(this.onEnd[1])==='function')
            this.onEnd[1].call(this.onEnd[0])
    }

    private autoUpdate(context:any) {
        --context.timerTime
        if(context.timerTime<=0) {
            clearInterval(context.autoUpdaterTask)
            context.richTextTimer.string=context.getFormattedText(0,context)
        }
        else
            context.richTextTimer.string=context.getFormattedText(context.timerTime,context)
        context.resetSize()
    }

    public update() {
        this.timerTime=Math.floor(this.maxTime-(Date.now()/1000)+this.startTime)
        if(this.timerTime<=0)
            this.richTextTimer.string=this.getFormattedText(0)
        else
            this.richTextTimer.string=this.timerTime.toString()
        this.resetSize()
    }

    public destroy() {
        if(this.autoUpdaterTask)
            clearInterval(this.autoUpdaterTask)
        this.nodeTimer.destroyAllChildren()
        this.nodeTimer.destroy()
    }

    /*public setPosition(x:number, y:number) {
        return this.nodeTimer.setPosition(x,y)
    }

    public setAnchorPoint(x:number, y:number) {
        return this.nodeTimer.setAnchorPoint(x,y)
    }*/
}