{
    //实例化模块
    let game = new Jigsaw({
                boxId:"gameBox",
                img:"mainImg",
                imgInput:"btn-image",
            });
    game.init()
    
    //开始按钮事件，过滤难度信息
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
}