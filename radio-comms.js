class sendClass {
    str: string
    bool: boolean
    constructor(instr: string, inbool: boolean) {
        this.str = instr
        this.bool = inbool
    }
    print() {
        if (this.str) basic.showString(this.str)
    }
}
let test = new sendClass("test", true)

radio.onReceivedNumber(function (receivedNumber: number) {
    basic.showNumber(receivedNumber)
})

radio.onReceivedString(function (receivedString: string) {
    basic.showString(receivedString)
})

input.onButtonPressed(Button.A, function () {
    radio.sendNumber(25)
})

input.onButtonPressed(Button.B, function () {
    radio.sendNumber(3.14)
})

input.onGesture(Gesture.Shake, function () {
    radio.sendString("Hello!")
})

input.onGesture(Gesture.LogoUp, function () {
    radio.sendString('c')
})

input.onGesture(Gesture.LogoDown, function () {
    radio.sendString("function o(){return 1}")
})
radio.sendNumber(0)
radio.setTransmitPower(7)
radio.setGroup(1)
