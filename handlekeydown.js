function handlekeydown(e)
{
    // Q W E A S D
    if(e.keyCode==87) angleX=angleX+1.0; //W
    if(e.keyCode==83) angleX=angleX-1.0; //S
    if(e.keyCode==68) angleY=angleY+1.0;
    if(e.keyCode==65) angleY=angleY-1.0;
    if(e.keyCode==81) angleZ=angleZ+1.0;
    if(e.keyCode==69) angleZ=angleZ-1.0;
    //alert(e.keyCode);
    //alert(angleX);

    //U I O J K L
    if(e.keyCode==76) LightPositionX=LightPositionX+0.1;
    if(e.keyCode==74) LightPositionX=LightPositionX-0.1;
    if(e.keyCode==73) LightPositionY=LightPositionY+0.1;
    if(e.keyCode==75) LightPositionY=LightPositionY-0.1;
    if(e.keyCode==85) LightPositionZ=LightPositionZ+0.1;
    if(e.keyCode==79) LightPositionZ=LightPositionZ-0.1;
}