/*
 *Jigsaw()
  参数{
    boxId:'主容器id'，
    img:'主预览图id'，//最终用于裁剪的图像尺寸与数据来自主预览图，主预览图和主容器需要适当的css配合
    level:[行数,列数]
 }
 * init()初始化，根据屏幕大小设定主图尺寸、绑定图片上传的事件
 *_getData()在图片上传之后调用，获取图片和尺寸给canvas
 * creatChip() 根据难度创建相应碎片并写入，隐藏主图
 * _switchChips(box-id1,box-id2) 交换两个碎片，如果是相邻的有动画效果，参数是数字或者字符串
 * _setTarget（box-id），将指定碎片设定为目标，只允许这个碎片周围的碎片向这个碎片移动，参数是数字或者字符串
 * initChip（）将最后一个碎片图像清空，并设定为目标。为所有碎片绑定移动事件（pc端拖拽、移动端点击）。
 * spinStaff() 给所有碎片引入随机旋转和点击旋转事件,默认移动端没有此选项
 * _checkWin() 检查是否满足胜利条件
 * setPuzzle() 打乱拼图
*/
function Jigsaw(a){
    this.mainBox = document.getElementById(a.boxId)
    this.img = document.getElementById(a.img)
    this.imgInput = document.getElementById(a.imgInput)
    this.level = a.level?a.level:[3,3]
    
    this.backstage = document.createElement('canvas')
    this.ctx = this.backstage.getContext('2d')
};
Jigsaw.prototype = {
    init:function(){     
        let that = this
        that.mainBox.style.maxHeight = window.innerHeight*0.9+'px'
        that.img.classList.remove('none')
            if(document.querySelector(".gamebox")){
                that.mainBox.removeChild(document.querySelector(".gamebox"))
            }
        that.imgInput.onchange = function(e){
            that.init()
            let img = this.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(img); //  base64
            reader.onloadend = function () {
                that.img.src = reader.result;
        };           
     };    
    }
    ,_getData:function(){
        this.backstage.height = this.img.height
        this.backstage.width = this.img.width
        this.ctx.drawImage(this.img,0,0,this.backstage.width,this.backstage.height)
    }
    ,creatChip:function(){
        this._getData()
        let x = this.level[1]
        let y = this.level[0]
        let width = this.backstage.width/x
        let height = this.backstage.height/y       
        let gamebox = document.createElement('div')
        let num = 0
        for(let i=0; i<y;i++){
            for(let j=0; j<x;j++){
                let newChip = document.createElement('canvas')
                let ctx = newChip.getContext('2d')
                newChip.width = width
                newChip.height = height
                newChip.classList.add('chips')
                newChip.setAttribute('order',num)                
                newChip.setAttribute('box-id',++num)
                ctx.drawImage(this.backstage,j*width,i*height,width,height,0,0,width,height)
                gamebox.appendChild(newChip)
            }
        }
        gamebox.classList.add('gamebox')
        gamebox.style.width = gamebox.style.minWidth =this.backstage.width+2*x+'px'
        this.img.classList.add('none');
        this.mainBox.appendChild(gamebox)
    }
    ,_switchChips:function(box_id1,box_id2,animationOFF){
        const that = this;
        let canvas_a = document.querySelector('[box-id="'+box_id1+'"]')
        let canvas_b = document.querySelector('[box-id="'+box_id2+'"]')
        if(!canvas_a||!canvas_b) return '目标错误';
        let img_a = document.createElement('canvas')    
        let img_b = document.createElement('canvas')
        
            img_a.height = img_b.height = canvas_a.height
            img_a.width = img_b.width = canvas_a.width         
            let img_a_ctx = img_a.getContext('2d')
            let img_b_ctx = img_b.getContext('2d')           
            img_a_ctx.drawImage(canvas_a,0,0)
            img_b_ctx.drawImage(canvas_b,0,0)
        
        
        let order_a = canvas_a.getAttribute('order')
        let order_b = canvas_b.getAttribute('order')
      
        const ctx_a = canvas_a.getContext('2d')
        const ctx_b = canvas_b.getContext('2d')
        
        const hardSwitch = function(){
             ctx_a.clearRect(0,0,canvas_a.width,canvas_a.height)
             ctx_b.clearRect(0,0,canvas_b.width,canvas_b.height)
             ctx_a.drawImage(img_b,0,0)        
             ctx_b.drawImage(img_a,0,0)
        }
          /*过渡动画*/        
        let direction = box_id1 - box_id2
        if(animationOFF){direction = 0}
         switch(direction){
            case -1:{                
                    let x = 0
                    let timer = setInterval(function(){
                    ctx_b.clearRect(0,0,canvas_b.width,canvas_b.height)
                    ctx_b.drawImage(img_a,x-canvas_b.width,0)
                    ctx_a.clearRect(0,0,canvas_a.width,canvas_a.height)
                    ctx_a.drawImage(img_a,x,0)
                    if(x>canvas_a.width){
                        hardSwitch()
                        clearInterval(timer)
                    }
                    x = x+3 //speed
                },1);
                
            }break;
             case 1:{
                 let x = 0
                 let timer = setInterval(function(){
                    ctx_b.clearRect(0,0,canvas_b.width,canvas_b.height)
                    ctx_b.drawImage(img_a,canvas_b.width-x,0)
                    ctx_a.clearRect(0,0,canvas_a.width,canvas_a.height)
                    ctx_a.drawImage(img_a,-x,0)
                    if(x>canvas_a.width){
                         hardSwitch()
                         clearInterval(timer)
                     }
                     x = x+3 //speed
                 },1)
             }break;
             case that.level[1]:{
                 let y = 0
                 let timer = setInterval(function(){
                    ctx_b.clearRect(0,0,canvas_b.width,canvas_b.height)
                    ctx_b.drawImage(img_a,0,canvas_b.height-y)
                    ctx_a.clearRect(0,0,canvas_a.width,canvas_a.height)
                    ctx_a.drawImage(img_a,0,-y)
                     if(y>canvas_a.height){
                         hardSwitch()
                         clearInterval(timer)
                     }
                     y = y+3 //speed
                 },1)
             }break;
             case -that.level[1]:{
                 let y = 0
                 let timer = setInterval(function(){
                    ctx_b.clearRect(0,0,canvas_b.width,canvas_b.height)
                    ctx_b.drawImage(img_a,0,y-canvas_b.height)
                    ctx_a.clearRect(0,0,canvas_a.width,canvas_a.height)
                    ctx_a.drawImage(img_a,0,y)
                     if(y>canvas_a.height){
                         hardSwitch()
                         clearInterval(timer)
                     }
                    y = y+3 //speed 
                 },1)
             }break;
                 
             default:{
                 hardSwitch()
             }
        }
       
        
        canvas_a.setAttribute('order',order_b)
        canvas_b.setAttribute('order',order_a)
        
        let spinFlag = canvas_a.getAttribute('spinstyle')
        if(spinFlag){
            canvas_a.setAttribute('spinstyle',canvas_b.getAttribute('spinstyle'))
            canvas_b.setAttribute('spinstyle',spinFlag)
        }
    }
    ,_setTarget:function(targetBoxId){
        targetBoxId = Number(targetBoxId)
        let chipList = document.getElementsByClassName('chips')
        for(let index=0; index < chipList.length; index++){
            chipList[index].classList.remove('source','target')
        }
        document.querySelector('[box-id="'+targetBoxId+'"]').classList.add('target')
        if(targetBoxId - this.level[1] >0){
           document.querySelector('[box-id="'+(targetBoxId-this.level[1])+'"]').classList.add('source') 
        }
        if(targetBoxId + this.level[1] <= this.level[0]*this.level[1]){
            document.querySelector('[box-id="'+(targetBoxId+this.level[1])+'"]').classList.add('source') 
        }
        if((targetBoxId % this.level[1]) == 1){
            document.querySelector('[box-id="'+(targetBoxId+1)+'"]').classList.add('source') 
        }
        else if(targetBoxId % this.level[1] == 0){
            document.querySelector('[box-id="'+(targetBoxId-1)+'"]').classList.add('source') 
        }
        else{
            document.querySelector('[box-id="'+(targetBoxId-1)+'"]').classList.add('source')
            document.querySelector('[box-id="'+(targetBoxId+1)+'"]').classList.add('source')
        }
        
    }
    ,initChip:function(){
        const that = this
        that._setTarget(this.level[0]*this.level[1])
        
        let chips = document.getElementsByClassName('chips')
        let ctx = chips[chips.length-1].getContext('2d')
        ctx.clearRect(0,0,chips[chips.length-1].width+2,chips[chips.length-1].height+2)
        let sourceId = ''
        
        if(window.matchMedia('(min-width:1024px)').matches){            
            for(let index=0; index < chips.length; index++){
                chips[index].setAttribute('draggable','true')                
                chips[index].addEventListener('dragstart',function(e){                    
                    if(e.target.classList.contains('source')){
                        sourceId = e.target.getAttribute('box-id')
                        e.dataTransfer.setData("text",sourceId); 
                    }
                    else{
                        e.preventDefault()
                    }                    
                },true)
                
                chips[index].addEventListener('dragenter',function(e){
                    if(e.target.classList.contains('target')){
                        e.preventDefault()
                    }
                },true)
                
                chips[index].addEventListener('dragover',function(e){
                    if(e.target.classList.contains('target')){
                        e.target.classList.add('on-over')
                        e.preventDefault()
                    }
                },true)
                
                chips[index].addEventListener('dragleave',function(e){
                    if(e.target.classList.contains('target')){
                        e.target.classList.remove('on-over')
                        e.preventDefault()
                        console.log('leave')
                    }
                },false)
                
                chips[index].addEventListener('drop',function(e){   
                    e.preventDefault()//阻止火狐默认打开新的窗口的行为
                    e.target.classList.remove('on-over')  
                    that._switchChips(sourceId,e.target.getAttribute('box-id'))
                    that._setTarget(sourceId)
                    that._checkWin()
                },false)
                                            
            }
        }
        else{
            for(let index=0; index < chips.length; index++){                
                chips[index].addEventListener('click',function(e){
                    if(e.target.classList.contains('source')){
                        let targetId = document.querySelector('.target').getAttribute('box-id')
                        sourceId = e.target.getAttribute('box-id')
                        that._switchChips(sourceId,targetId)
                        that._setTarget(sourceId)
                        that._checkWin()
                    }
                },false)
            }
        }
    }
    ,spinStaff:function(){
        let that = this
        let chips = document.getElementsByClassName('chips')
        for(let index=0; index < chips.length; index++){
            chips[index].setAttribute('spinStyle',Math.floor(Math.random()*1000%4))
            chips[index].addEventListener('click',function(e){                
                let spin = Number(e.target.getAttribute('spinStyle'))
                e.target.setAttribute('spinStyle',++spin%4)
                that._checkWin()
            },false)
        }
        chips[chips.length-1].setAttribute('spinStyle',0)
    }
    ,_checkWin:function(){
        let that = this
        if(document.querySelector('.target').hasAttribute('spinstyle')){
            document.querySelector('.target').setAttribute('spinstyle',0)
        }
        let chips = document.getElementsByClassName('chips')        
        for(let index=0; index < chips.length; index++){
            let spin = chips[index].getAttribute('spinstyle')            
            let order = chips[index].getAttribute('order') == index
            if(!order){
                return;
            }
            if(spin){
                if(spin != 0){
                    return
                }
            }            
        }
        setTimeout(function(){
            that.mainBox.removeChild(document.querySelector(".gamebox"))
            that.img.classList.remove('none')
            document.getElementById('btn-menu').checked=false
            alert('胜利达成！')
        },1000)
        
    }
    ,setPuzzle:function(){
        let that = this
        let num = that.level[0]*that.level[1]*5
        let targetId = Number(document.querySelector('.target').getAttribute('box-id'))
        let old_direction = 0
        let timer = setInterval(function(){
            let direction =  Math.floor(Math.random()*1000%4)
            let sourceId = ''
            switch(direction){
                case 0:{
                    if(targetId%that.level[1] == 1){return}
                    else if(old_direction == 2){return}
                    sourceId = targetId-1
                }break;
                case 1:{
                    if(targetId <= that.level[1]){return}
                    else if(old_direction == 3){return}
                    sourceId = targetId - that.level[1]
                }break;
                case 2:{
                    if(targetId%that.level[1] == 0){return}
                    else if(old_direction ==2){return}
                    sourceId = targetId+1
                }break;
                case 3:{
                    if(targetId > (that.level[0]-1)*that.level[1]){return}
                    else if(old_direction == 1){return}
                    sourceId = targetId + that.level[1] 
                }break;
            }
            that._switchChips(sourceId,targetId,true)
            that._setTarget(sourceId)
            targetId = sourceId
            old_direction = direction
            num--
            if(num==0){clearInterval(timer)}
        },1)
    }
    
};

var game = new Jigsaw({
                boxId:"gameBox",
                img:"mainImg",
                imgInput:"btn-image"
            });

(function(){
    game.init()   
    document.getElementById('btn-start').addEventListener('click',function(){
        game.init()
        let y = parseInt(document.getElementById('yNum').value);
        document.getElementById('yNum').value = y;
        let x = parseInt(document.getElementById('xNum').value);
        document.getElementById('xNum').value = x;        
        if(x>=2&y>=2&x*y<=100){
            game.level=[x,y]
            game.creatChip()
            game.initChip()
            if(document.getElementById('spin').checked){
                game.spinStaff()
            }
            game.setPuzzle()
            document.getElementById('btn-menu').checked=true
        }
        else(alert('试着选个正常的难度...'))
    },false)
})()
