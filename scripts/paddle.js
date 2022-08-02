const SPEED = .01;

export default class Paddle{
    constructor(paddle){
        this.paddle = paddle;
        this.reset();
    }

    get position(){
        return parseFloat(getComputedStyle(this.paddle).getPropertyValue('--y'));
    }

    set position(value){
        this.paddle.style.setProperty("--y", value)
    }

    dontOverflow(){
        if(this.rect().y > window.innerHeight - this.rect().height){
            this.position -= 10;
        }

        if(this.rect().y < 0){
            this.position += 10
        }
    }

    update(delta, ballHeitgh){
        this.position += SPEED * delta * (ballHeitgh - this.position);
    }

    reset(){
        this.position = 50;
    }

    rect(){
        return this.paddle.getBoundingClientRect();
    }
}