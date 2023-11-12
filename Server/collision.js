
function lineLineCross(a,b,c,d){
    //line 1: endpoint1 [x,y], endpoint2 [x,y],line 2: endpoint1 [x,y], endpoint2 [x,y]
    var m1 = (b[1]-a[1])/(b[0]-a[0]);
    var m2 = (d[1]-c[1])/(d[0]-c[0]);
    //find intersect point (TRUST THE ALGEBRA)
    var x = (-m2*c[0]+m1*a[0]+c[1]-a[1])/(m1-m2);
    if (b[0]-a[0] === 0){x = a[0];}
    if (c[0]-d[0] === 0){x = c[0];}
    var y = m1*(x-a[0])+a[1];
    if (b[1]-a[1] === 0){y = a[1];}
    if (c[1]-d[1] === 0){y = c[1];}
    var o = [a,b,c,d];
    for (var i = 0; i < 4; i++){
        for (var j = 0; j < 4; j++){
            if (o[i][1]<o[j][1]){
                var temp = o[i];
                o[i] = o[j];
                o[j] = temp;
            }
        }
    }
    if (!y){y = (o[1][1]+o[2][1])/2;}//vertical lines
    if ((x>=a[0]&&x<=b[0]||x>=b[0]&&x<=a[0])&&(x>=c[0]&&x<=d[0]||x>=d[0]&&x<=c[0])&&
    (y>=a[1]&&y<=b[1]||y>=b[1]&&y<=a[1])&&(y>=c[1]&&y<=d[1]||y>=d[1]&&y<=c[1])){
      return [x,y];//return intersection point
    }
    return false;
  };



module.exports= lineLineCross;

