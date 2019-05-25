/*
 *Jigsaw()
 *参数{
    boxId:'主容器id'，
    img:'主预览图id'，//最终用于裁剪的图像尺寸与数据来自主预览图，主预览图和主容器需要适当的css配合
    level:[行数,列数]
 }
 * init()初始化，根据屏幕大小设定主图尺寸、绑定图片上传的事件
 *_getData()在图片上传之后调用，获取图片和尺寸给canvas
 * creatChip() 根据难度创建相应碎片并写入，隐藏主图
 * _switchChips(id1,id2) 参数格式："0-0","0-1"(第一行第一列/第一行第二列),交换两个碎片
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
        
        that.imgInput.onchange = function(e){
            that.img.classList.remove('none')
            if(document.querySelector(".gamebox")){
                that.mainBox.removeChild(document.querySelector(".gamebox"))
            }
            let img = this.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(img); // 读出 base64
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
        let num = 1
        for(let i=0; i<y;i++){
            for(let j=0; j<x;j++){
                let newChip = document.createElement('canvas')
                let ctx = newChip.getContext('2d')
                newChip.width = width
                newChip.height = height
                newChip.classList.add('chips')
                newChip.setAttribute('box-id',i+'-'+j)
                newChip.setAttribute('order',num++)
                ctx.drawImage(this.backstage,j*width,i*height,width,height,0,0,width,height)
                gamebox.appendChild(newChip)
            }
        }
        gamebox.classList.add('gamebox')
        gamebox.style.width = gamebox.style.minWidth =this.backstage.width+2*x+'px'
        this.img.classList.add('none');
        this.mainBox.appendChild(gamebox)
    }
    ,_switchChips:function(box_id1,box_id2){
        let canvas_a = document.querySelector('[box-id="'+box_id1+'"]')
        let canvas_b = document.querySelector('[box-id="'+box_id2+'"]')
        if(!canvas_a||!canvas_b) return '目标错误';
        const img_a = document.createElement('canvas')    
        const img_b = document.createElement('canvas')
        {
            let img_a_ctx = img_a.getContext('2d')
            let img_b_ctx = img_b.getContext('2d')       
            img_a.height = img_b.height = canvas_a.height
            img_a.width = img_b.width = canvas_a.width             
            img_a_ctx.drawImage(canvas_a,0,0)
            img_b_ctx.drawImage(canvas_b,0,0)
        }
        
        let order_a = canvas_a.getAttribute('order')
        let order_b = canvas_b.getAttribute('order')
        /*动画方向*/
        const direction = (function(){
            const num_a = box_id1.split('-')
            const num_b = box_id2.split('-')        
            if(num_a[0] == num_b[0]){
                if(num_a[1] < num_b[1])  return 'right';
                if(num_a[1] > num_b[1])  return 'left';
            }
            else if(num_a[1] == num_b[1]){
                if(num_a[0] > num_b[0]) return 'up';
                if(num_a[0] < num_b[0]) return 'down';
            }
            else 
                return 'other';
        })()
        const ctx_a = canvas_a.getContext('2d')
        const ctx_b = canvas_b.getContext('2d')
        
       
         switch(direction){
            case 'right':{                
                    let x = 0
                    let timer = setInterval(function(){
                    ctx_b.clearRect(0,0,canvas_b.width,canvas_b.height)
                    ctx_b.drawImage(img_a,x-canvas_b.width,0)
                    ctx_a.clearRect(0,0,canvas_a.width,canvas_a.height)
                    ctx_a.drawImage(img_a,x++,0)
                    if(x>=canvas_a.width){
                        ctx_a.drawImage(img_b,0,0)        
                        ctx_b.drawImage(img_a,0,0)
                        clearInterval(timer)
                    }
                },1);
                
            }break;
             case 'left':{
                 let x = 0
                 let timer = setInterval(function(){
                    ctx_b.clearRect(0,0,canvas_b.width,canvas_b.height)
                    ctx_b.drawImage(img_a,canvas_b.width-x,0)
                    ctx_a.clearRect(0,0,canvas_a.width,canvas_a.height)
                    ctx_a.drawImage(img_a,-x++,0)
                     if(x>=canvas_a.width){
                         ctx_a.drawImage(img_b,0,0)        
                         ctx_b.drawImage(img_a,0,0)
                         clearInterval(timer)
                     }
                 })
             }break;
             case 'up':{
                 let y = 0
                 let timer = setInterval(function(){
                    ctx_b.clearRect(0,0,canvas_b.width,canvas_b.height)
                    ctx_b.drawImage(img_a,0,canvas_b.height-y)
                    ctx_a.clearRect(0,0,canvas_a.width,canvas_a.height)
                    ctx_a.drawImage(img_b,0,-y++)
                     if(y>=canvas_a.height){
                         ctx_a.drawImage(img_b,0,0)        
                         ctx_b.drawImage(img_a,0,0)
                         clearInterval(timer)
                     }
                 })
             }break;
             case 'down':{
                 let y = 0
                 let timer = setInterval(function(){
                    ctx_b.clearRect(0,0,canvas_b.width,canvas_b.height)
                    ctx_b.drawImage(img_a,0,y-canvas_b.height)
                    ctx_a.clearRect(0,0,canvas_a.width,canvas_a.height)
                    ctx_a.drawImage(img_b,0,y++)
                     if(y>=canvas_a.height){
                         ctx_a.drawImage(img_b,0,0)        
                         ctx_b.drawImage(img_a,0,0)
                         clearInterval(timer)
                     }
                 })
             }break;
             case 'other':{
                 ctx_a.drawImage(img_b,0,0)        
                 ctx_b.drawImage(img_a,0,0)
             }
        }
       
        
        canvas_a.setAttribute('order',order_b)
        canvas_b.setAttribute('order',order_a)
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
        let y = parseInt(document.getElementById('yNum').value);
        document.getElementById('yNum').value = y;
        let x = parseInt(document.getElementById('xNum').value);
        document.getElementById('xNum').value = x;        
        if(x>=2&y>=2&x*y<=100){
            game.level=[x,y]
            game.creatChip();
            
            document.getElementById('btn-menu').checked=true
        }
        else(alert('试着选个正常的难度...'))
    },false)
})()
