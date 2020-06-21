var gl;
var shaderProgram;
var uPMatrix;
var vertexPositionBuffer;
var vertexColorBuffer;
var vertexCoordsBuffer;
var vertexNormalBuffer;
var vertexBiNormalBuffer;

function MatrixMul(a,b) //Mnożenie macierzy
{
    let c = [
        0,0,0,0,
        0,0,0,0,
        0,0,0,0,
        0,0,0,0
    ];
    for(let i=0;i<4;i++)
    {
        for(let j=0;j<4;j++)
        {
            c[i*4+j] = 0.0;
            for(let k=0;k<4;k++)
            {
                c[i*4+j]+= a[i*4+k] * b[k*4+j];
            }
        }
    }
    return c;
}

function MatrixTransposeInverse(m)
{
    let r = [
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0,
        0, 0, 0, 0
    ];
    r[0] = m[5]*m[10]*m[15] - m[5]*m[14]*m[11] - m[6]*m[9]*m[15] + m[6]*m[13]*m[11] + m[7]*m[9]*m[14] - m[7]*m[13]*m[10];
    r[1] = -m[1]*m[10]*m[15] + m[1]*m[14]*m[11] + m[2]*m[9]*m[15] - m[2]*m[13]*m[11] - m[3]*m[9]*m[14] + m[3]*m[13]*m[10];
    r[2] = m[1]*m[6]*m[15] - m[1]*m[14]*m[7] - m[2]*m[5]*m[15] + m[2]*m[13]*m[7] + m[3]*m[5]*m[14] - m[3]*m[13]*m[6];
    r[3] = -m[1]*m[6]*m[11] + m[1]*m[10]*m[7] + m[2]*m[5]*m[11] - m[2]*m[9]*m[7] - m[3]*m[5]*m[10] + m[3]*m[9]*m[6];
    r[4] = -m[4]*m[10]*m[15] + m[4]*m[14]*m[11] + m[6]*m[8]*m[15] - m[6]*m[12]*m[11] - m[7]*m[8]*m[14] + m[7]*m[12]*m[10];
    r[5] = m[0]*m[10]*m[15] - m[0]*m[14]*m[11] - m[2]*m[8]*m[15] + m[2]*m[12]*m[11] + m[3]*m[8]*m[14] - m[3]*m[12]*m[10];
    r[6] = -m[0]*m[6]*m[15] + m[0]*m[14]*m[7] + m[2]*m[4]*m[15] - m[2]*m[12]*m[7] - m[3]*m[4]*m[14] + m[3]*m[12]*m[6];
    r[7] = m[0]*m[6]*m[11] - m[0]*m[10]*m[7] - m[2]*m[4]*m[11] + m[2]*m[8]*m[7] + m[3]*m[4]*m[10] - m[3]*m[8]*m[6];
    r[8] = m[4]*m[9]*m[15] - m[4]*m[13]*m[11] - m[5]*m[8]*m[15] + m[5]*m[12]*m[11] + m[7]*m[8]*m[13] - m[7]*m[12]*m[9];
    r[9] = -m[0]*m[9]*m[15] + m[0]*m[13]*m[11] + m[1]*m[8]*m[15] - m[1]*m[12]*m[11] - m[3]*m[8]*m[13] + m[3]*m[12]*m[9];
    r[10] = m[0]*m[5]*m[15] - m[0]*m[13]*m[7] - m[1]*m[4]*m[15] + m[1]*m[12]*m[7] + m[3]*m[4]*m[13] - m[3]*m[12]*m[5];
    r[11] = -m[0]*m[5]*m[11] + m[0]*m[9]*m[7] + m[1]*m[4]*m[11] - m[1]*m[8]*m[7] - m[3]*m[4]*m[9] + m[3]*m[8]*m[5];
    r[12] = -m[4]*m[9]*m[14] + m[4]*m[13]*m[10] + m[5]*m[8]*m[14] - m[5]*m[12]*m[10] - m[6]*m[8]*m[13] + m[6]*m[12]*m[9];
    r[13] = m[0]*m[9]*m[14] - m[0]*m[13]*m[10] - m[1]*m[8]*m[14] + m[1]*m[12]*m[10] + m[2]*m[8]*m[13] - m[2]*m[12]*m[9];
    r[14] = -m[0]*m[5]*m[14] + m[0]*m[13]*m[6] + m[1]*m[4]*m[14] - m[1]*m[12]*m[6] - m[2]*m[4]*m[13] + m[2]*m[12]*m[5];
    r[15] = m[0]*m[5]*m[10] - m[0]*m[9]*m[6] - m[1]*m[4]*m[10] + m[1]*m[8]*m[6] + m[2]*m[4]*m[9] - m[2]*m[8]*m[5];
    var det = m[0]*r[0] + m[1]*r[4] + m[2]*r[8] + m[3]*r[12];
    for (var i = 0; i < 16; i++) r[i] /= det;

    let rt = [ r[0], r[4], r[8], r[12],
        r[1], r[5], r[9], r[13],
        r[2], r[6], r[10], r[14],
        r[3], r[7], r[11], r[15]
    ];

    return rt;
}

function CreateIdentytyMatrix()
{
    return [
        1,0,0,0, //Macierz jednostkowa
        0,1,0,0,
        0,0,1,0,
        0,0,0,1
    ];
}

function CreateTranslationMatrix(tx,ty,tz)
{
    return  [
        1,0,0,0,
        0,1,0,0,
        0,0,1,0,
        tx,ty,tz,1
    ];
}

function CreateScaleMatrix(sx,sy,sz)
{
    return [
        sx,0,0,0,
        0,sy,0,0,
        0,0,sz,0,
        0,0,0,1
    ];
}

function CreateRotationZMatrix(angleZ)
{
    return [
        +Math.cos(angleZ*Math.PI/180.0),+Math.sin(angleZ*Math.PI/180.0),0,0,
        -Math.sin(angleZ*Math.PI/180.0),+Math.cos(angleZ*Math.PI/180.0),0,0,
        0,0,1,0,
        0,0,0,1
    ];
}

function CreateRotationYMatrix(angleY)
{
    return [
        +Math.cos(angleY*Math.PI/180.0),0,-Math.sin(angleY*Math.PI/180.0),0,
        0,1,0,0,
        +Math.sin(angleY*Math.PI/180.0),0,+Math.cos(angleY*Math.PI/180.0),0,
        0,0,0,1
    ];
}

function CreateRotationXMatrix(angleX)
{
    return [
        1,0,0,0,
        0,+Math.cos(angleX*Math.PI/180.0),+Math.sin(angleX*Math.PI/180.0),0,
        0,-Math.sin(angleX*Math.PI/180.0),+Math.cos(angleX*Math.PI/180.0),0,
        0,0,0,1
    ];
}


function createRectCoords(mu,mv,dau,dav,dbu,dbv)
{
    let p1u = mu;             p1v = mv;
    let p2u = mu + dau;       p2v = mv + dav;
    let p3u = mu + dbu;       p3v = mv + dbv;
    let p4u = mu + dau + dbu; p4v = mv + dav + dbv;

    let vertexCoord = [p1u,p1v, p2u,p2v, p4u,p4v,  //Pierwszy trójkąt
        p1u,p1v, p4u,p4v, p3u,p3v]; //Drugi trójkąt

    return vertexCoord;
}

function createRect2(p1x,p1y,p1z,p2x,p2y,p2z,p3x,p3y,p3z,p4x,p4y,p4z)
{
    let vertexPosition = [p1x,p1y,p1z, p2x,p2y,p2z, p4x,p4y,p4z,  //Pierwszy trójkąt
        p1x,p1y,p1z, p4x,p4y,p4z, p3x,p3y,p3z]; //Drugi trójkąt

    return vertexPosition;
}

function CreateShpere(x,y,z,radius, numStepsElevation, numStepsAngle, lightDirection)
{
    //Opis sceny 3D, położenie punktów w przestrzeni 3D w formacie X,Y,Z
    let vertexPosition = []; //3 punkty po 3 składowe - X1,Y1,Z1, X2,Y2,Z2, X3,Y3,Z3 - 1 trójkąt
    let vertexNormal = [];
    let vertexColor = []; //3 punkty po 3 składowe - R1,G1,B1, R2,G2,B2, R3,G3,B3 - 1 trójkąt
    let vertexCoords = []; //3 punkty po 2 składowe - U1,V1, U2,V2, U3,V3 - 1 trójkąt
    let vertexBiNormal = [];

    let stepElevation = 90/numStepsElevation;
    let stepAngle = 360/numStepsAngle;
    for(let elevation=-90; elevation< 90; elevation+= stepElevation)
    {
        let radiusXZ = radius*Math.cos(elevation*Math.PI/180);
        let radiusY  = radius*Math.sin(elevation*Math.PI/180);

        let radiusXZ2 = radius*Math.cos((elevation+stepElevation)*Math.PI/180);
        let radiusY2  = radius*Math.sin((elevation+stepElevation)*Math.PI/180);

        for(let angle = 0; angle < 360; angle+= stepAngle)
        {

            let px1 = radiusXZ*Math.cos(angle*Math.PI/180);
            let py1 = radiusY;
            let pz1 = radiusXZ*Math.sin(angle*Math.PI/180);

            let px2 = radiusXZ*Math.cos((angle+stepAngle)*Math.PI/180);
            let py2 = radiusY;
            let pz2 = radiusXZ*Math.sin((angle+stepAngle)*Math.PI/180);

            let px3 = radiusXZ2*Math.cos(angle*Math.PI/180);
            let py3 = radiusY2;
            let pz3 = radiusXZ2*Math.sin(angle*Math.PI/180);

            let px4 = radiusXZ2*Math.cos((angle+stepAngle)*Math.PI/180);
            let py4 = radiusY2;
            let pz4 = radiusXZ2*Math.sin((angle+stepAngle)*Math.PI/180);

            vertexPosition.push(...createRect2(px1+x,py1+y,pz1+z,px2+x,py2+y,pz2+z,px3+x,py3+y,pz3+z,px4+x,py4+y,pz4+z));

            let p1 = Math.sqrt(px1*px1+py1*py1+pz1*pz1);
            let p2 = Math.sqrt(px2*px2+py2*py2+pz2*pz2);
            let p3 = Math.sqrt(px3*px3+py3*py3+pz3*pz3);
            let p4 = Math.sqrt(px4*px4+py4*py4+pz4*pz4);

            px1 /= p1;
            py1 /= p1;
            pz1 /= p1;

            px2 /= p2;
            py2 /= p2;
            pz2 /= p2;

            px3 /= p3;
            py3 /= p3;
            pz3 /= p3;

            px4 /= p4;
            py4 /= p4;
            pz4 /= p4;

            vertexNormal.push(...createRect2(px1,py1,pz1,px2,py2,pz2,px3,py3,pz3,px4,py4,pz4));

            vertexCoords.push(...createRectCoords(angle/360.0,(elevation+90.0)/180.0,(stepAngle)/360.0,0.0,0.0,(stepElevation)/180.0));

            vertexBiNormal.push(...createRect2(px1,py1,pz1,px2,py2,pz2,px3,py3,pz3,px4,py4,pz4));
        }
    }

    return [vertexPosition, vertexNormal, vertexBiNormal, vertexCoords];
}

function startGL()
{
    let canvas = document.getElementById("canvas3D"); //wyszukanie obiektu w strukturze strony
    gl = canvas.getContext("experimental-webgl"); //pobranie kontekstu OpenGL'u z obiektu canvas
    gl.viewportWidth = canvas.width; //przypisanie wybranej przez nas rozdzielczości do systemu OpenGL
    gl.viewportHeight = canvas.height;

    //Kod shaderów
    const vertextShaderSource = ` //Znak akcentu z przycisku tyldy - na lewo od przycisku 1 na klawiaturze
    precision highp float;
    attribute vec3 aVertexPosition; 
    attribute vec3 aVertexNormal;
    attribute vec3 aVertexBiNormal;
    attribute vec2 aVertexCoords;
    uniform mat4 uMMatrix;
    uniform mat4 uInvMMatrix;
    uniform mat4 uVMatrix;
    uniform mat4 uPMatrix;
    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec3 vBiNormal;
    varying vec2 vTexUV;
    uniform float uNormalMul;
    void main(void) {
      vPos = vec3(uMMatrix * vec4(aVertexPosition, 1.0));
      gl_Position = uPMatrix * uVMatrix * vec4(vPos,1.0); //Dokonanie transformacji położenia punktów z przestrzeni 3D do przestrzeni obrazu (2D)
      vNormal = normalize(mat3(uInvMMatrix) * uNormalMul*aVertexNormal); //Obrot wektorow normalnych
      vBiNormal = normalize(mat3(uInvMMatrix) * uNormalMul*aVertexBiNormal);
      vTexUV = aVertexCoords;
    }
  `;
    const fragmentShaderSource = `
    precision highp float;
    varying vec3 vPos;
    varying vec3 vNormal;
    varying vec3 vBiNormal;
    varying vec2 vTexUV;
    uniform sampler2D uSampler;
    uniform vec3 uLightPosition;
    void main(void) {
      vec3 lightDirection = normalize(uLightPosition - vPos);
      vec3 texNormal = normalize(vec3(texture2D(uSampler,vTexUV))*2.0-1.0);
      
      vec3 tangent = normalize(cross(vNormal,vBiNormal));
      //mat3 RotTexNormal = mat3(tangent,vNormal,vBiNormal);
      mat3 RotTexNormal = mat3(tangent,vBiNormal,vNormal); //działało
      //mat3 RotTexNormal = mat3(vNormal,vBiNormal,tangent);
      //mat3 RotTexNormal = mat3(vBiNormal,vNormal,tangent);
      //mat3 RotTexNormal = mat3(vBiNormal,tangent,vNormal); //Działało
      //mat3 RotTexNormal = mat3(vNormal,tangent,vBiNormal);
      
      //vec3 localNormal = normalize(vNormal+texNormal);
      vec3 localNormal = normalize(texNormal);
      //vec3 localNormal = RotTexNormal*texNormal;
      //vec3 localNormal = vNormal;
      //float brightness = max(dot(vNormal,lightDirection), 0.0);
      float brightness = max(dot(localNormal,lightDirection), 0.0);
      //float brightness  = 1.0;
      gl_FragColor = clamp(vec4(1.0,1.0,0.0,1.0) * vec4(brightness,brightness,brightness,1.0),0.0,1.0);
      //gl_FragColor = clamp(vec4(texNormal,1.0) * vec4(brightness,brightness,brightness,1.0),0.0,1.0);
      //gl_FragColor = clamp(vec4((localNormal+1.0)/2.0,1.0) * vec4(brightness,brightness,brightness,1.0),0.0,1.0);
    }
  `;
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER); //Stworzenie obiektu shadera
    let vertexShader   = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource); //Podpięcie źródła kodu shader
    gl.shaderSource(vertexShader, vertextShaderSource);
    gl.compileShader(fragmentShader); //Kompilacja kodu shader
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) { //Sprawdzenie ewentualnych błedów kompilacji
        alert(gl.getShaderInfoLog(fragmentShader));
        return null;
    }
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(vertexShader));
        return null;
    }

    shaderProgram = gl.createProgram(); //Stworzenie obiektu programu
    gl.attachShader(shaderProgram, vertexShader); //Podpięcie obu shaderów do naszego programu wykonywanego na karcie graficznej
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) alert("Could not initialise shaders");  //Sprawdzenie ewentualnych błedów

    //Opis sceny 3D, położenie punktów w przestrzeni 3D w formacie X,Y,Z
    let vertexPosition; //3 punkty po 3 składowe - X1,Y1,Z1, X2,Y2,Z2, X3,Y3,Z3 - 1 trójkąt
    let vertexNormal;
    let vertexBiNormal;
    let vertexCoords;

    [vertexPosition, vertexNormal, vertexBiNormal, vertexCoords] = CreateShpere(0,0,0,2, 6, 12);

    console.log(vertexCoords);

    vertexPositionBuffer = gl.createBuffer(); //Stworzenie tablicy w pamieci karty graficznej
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexPosition), gl.STATIC_DRAW);
    vertexPositionBuffer.itemSize = 3; //zdefiniowanie liczby współrzednych per wierzchołek
    vertexPositionBuffer.numItems = vertexPosition.length/9; //Zdefinoiowanie liczby trójkątów w naszym buforze

    vertexNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormal), gl.STATIC_DRAW);
    vertexNormalBuffer.itemSize = 3;
    vertexNormalBuffer.numItems = vertexNormal.length/9;

    vertexBiNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBiNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexBiNormal), gl.STATIC_DRAW);
    vertexBiNormalBuffer.itemSize = 3;
    vertexBiNormalBuffer.numItems = vertexBiNormal.length/9;

    vertexCoordsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexCoordsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexCoords), gl.STATIC_DRAW);
    vertexCoordsBuffer.itemSize = 2;
    vertexCoordsBuffer.numItems = vertexCoords.length/6;

    textureBuffer = gl.createTexture();
    var textureImg = new Image();
    textureImg.onload = function() { //Wykonanie kodu automatycznie po załadowaniu obrazka
        gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureImg); //Faktyczne załadowanie danych obrazu do pamieci karty graficznej
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); //Ustawienie parametrów próbkowania tekstury
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    };

    textureImg.src="texture.gif"; //Nazwa obrazka

    //Macierze opisujące położenie wirtualnej kamery w przestrzenie 3D
    let aspect = gl.viewportWidth/gl.viewportHeight;
    let fov = 45.0 * Math.PI / 180.0; //Określenie pola widzenia kamery
    let zFar = 100.0; //Ustalenie zakresów renderowania sceny 3D (od obiektu najbliższego zNear do najdalszego zFar)
    let zNear = 0.1;
    uPMatrix = [
        1.0/(aspect*Math.tan(fov/2)),0                           ,0                         ,0                            ,
        0                         ,1.0/(Math.tan(fov/2))         ,0                         ,0                            ,
        0                         ,0                           ,-(zFar+zNear)/(zFar-zNear)  , -1,
        0                         ,0                           ,-(2*zFar*zNear)/(zFar-zNear) ,0.0,
    ];
    Tick();
}
//let angle = 45.0; //Macierz transformacji świata - określenie położenia kamery
var angleZ = 0.0;
var angleY = 0.0;
var angleX = 0.0;
var KameraPositionZ = -8.0;

var Object1PositionX = 2.0;
var Object1PositionY = 0.0;
var Object1PositionZ = -0.0;

var LightSize = 0.1;
var Object1Size = 1.0;

var LightPositionX = 0;
var LightPositionY = 2;
var LightPositionZ = 2;

function Tick()
{
    let uMMatrix0 = CreateIdentytyMatrix();
    let uMMatrix1 = CreateIdentytyMatrix();

    let uVMatrix = CreateIdentytyMatrix();

    uVMatrix = MatrixMul(uVMatrix,CreateRotationXMatrix(angleX));
    uVMatrix = MatrixMul(uVMatrix,CreateRotationYMatrix(angleY));
    uVMatrix = MatrixMul(uVMatrix,CreateRotationZMatrix(angleZ));
    uVMatrix = MatrixMul(uVMatrix,CreateTranslationMatrix(0,0,KameraPositionZ));

    uMMatrix1 = MatrixMul(uMMatrix1,CreateScaleMatrix(Object1Size,Object1Size,Object1Size));
    uMMatrix1 = MatrixMul(uMMatrix1,CreateTranslationMatrix(Object1PositionX,Object1PositionY,Object1PositionZ));

    uMMatrix0 = MatrixMul(uMMatrix0,CreateScaleMatrix(LightSize,LightSize,LightSize));
    uMMatrix0 = MatrixMul(uMMatrix0,CreateTranslationMatrix(LightPositionX,LightPositionY,LightPositionZ));

    //Render Scene
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clearColor(0.4,0.4,0.4,1.0); //Wyczyszczenie obrazu kolorem czerwonym
    gl.clearDepth(1.0);             //Wyczyścienie bufora głebi najdalszym planem
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(shaderProgram);   //Użycie przygotowanego programu shaderowego

    gl.enable(gl.DEPTH_TEST);           // Włączenie testu głębi - obiekty bliższe mają przykrywać obiekty dalsze
    gl.depthFunc(gl.LEQUAL);            //

    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uPMatrix"), false, new Float32Array(uPMatrix)); //Wgranie macierzy kamery do pamięci karty graficznej
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uVMatrix"), false, new Float32Array(uVMatrix));
    gl.uniform1f(gl.getUniformLocation(shaderProgram, "uNormalMul"),1.0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textureBuffer);
    gl.uniform1i(gl.getUniformLocation(shaderProgram, "uSampler"), 0);

    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uMMatrix"), false, new Float32Array(uMMatrix1));
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uInvMMatrix"), false, new Float32Array(MatrixTransposeInverse(uMMatrix1)));

    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aVertexPosition"));  //Przekazanie położenia
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexPosition"), vertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aVertexNormal"));  //Przekazywanie wektorów normalnych
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexNormalBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexNormal"), vertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aVertexBiNormal"));  //Przekazywanie wektorów normalnych
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBiNormalBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexBiNormal"), vertexBiNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(gl.getAttribLocation(shaderProgram, "aVertexCoords"));  //Pass the geometry
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexCoordsBuffer);
    gl.vertexAttribPointer(gl.getAttribLocation(shaderProgram, "aVertexCoords"), vertexCoordsBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.uniform3f(gl.getUniformLocation(shaderProgram, "uLightPosition"),LightPositionX,LightPositionY,LightPositionZ);

    gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numItems*vertexPositionBuffer.itemSize); //Faktyczne wywołanie rendrowania

    //Obiekt Światła
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uMMatrix"), false, new Float32Array(uMMatrix0));
    gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uInvMMatrix"), false, new Float32Array(MatrixTransposeInverse(uMMatrix0)));
    gl.uniform1f(gl.getUniformLocation(shaderProgram, "uNormalMul"),-1.0);
    gl.drawArrays(gl.TRIANGLES, 0, vertexPositionBuffer.numItems*vertexPositionBuffer.itemSize); //Faktyczne wywołanie rendrowania

    setTimeout(Tick,100);
}
