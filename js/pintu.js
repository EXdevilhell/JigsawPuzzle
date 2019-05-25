/*
 *Jigsaw()
 *参数{
    boxId:'主容器id'，
    img:'主预览图id'，//最终用于裁剪的图像尺寸与数据来自主预览图，主预览图和主容器需要适当的css配合
    level:[行数,列数]
 }
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
    _init:function(){     
        let that = this
        that.mainBox.style.maxHeight = window.innerHeight*0.9+'px'
        
        that.imgInput.onchange = function(e){
            that.img.classList.remove('none')
            if(document.querySelector(".gamebox")){
                that.mainBox.removeChild(document.querySelector(".gamebox"))
            }
            var img = this.files[0];
            var reader = new FileReader();
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
        var x = this.level[1]
        var y = this.level[0]
        var width = this.backstage.width/x
        var height = this.backstage.height/y       
        let gamebox = document.createElement('div')
        let num = 1
        for(let i=0; i<y;i++){
            for(let j=0; j<x;j++){
                let newChip = document.createElement('canvas')
                let ctx = newChip.getContext('2d')
                newChip.width = width
                newChip.height = height
                newChip.classList.add('chips')
                newChip.setAttribute('id','box-'+i+'-'+j)
                newChip.setAttribute('order',num++)
                ctx.drawImage(this.backstage,j*width,i*height,width,height,0,0,width,height)
                gamebox.appendChild(newChip)
            }
        }
        gamebox.classList.add('gamebox')
        gamebox.style.width = gamebox.style.minWidth =this.backstage.width+2*y+'px'
        this.img.classList.add('none');
        this.mainBox.appendChild(gamebox)
    }
    ,switchChips:function(boxa,boxb,direction){
        
    }
};

var game = new Jigsaw({
                boxId:"gameBox",
                img:"mainImg",
                imgInput:"btn-image"
            });

(function(){
    game._init()   
    document.getElementById('btn-start').addEventListener('click',function(){
        let y = parseInt(document.getElementById('yNum').value);
        document.getElementById('yNum').value = y;
        let x = parseInt(document.getElementById('xNum').value);
        document.getElementById('xNum').value = x;        
        if(x>=2&y>=2&x*y<=100){
            game.level=[x,y]
            game._getData();
            game.creatChip();
            
            document.getElementById('btn-menu').checked=true
        }
        else(alert('试着选个正常的难度...'))
    },false)
})()
