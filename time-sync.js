class clock {
    min1: number
    min0: number
    sec1: number
    sec0: number
    constructor() {
    }
    setTime(timeIn: string) {
        this.min1 = parseInt(timeIn.charAt(0))
        this.min0 = parseInt(timeIn.charAt(1))
        this.sec1 = parseInt(timeIn.charAt(2))
        this.sec0 = parseInt(timeIn.charAt(3))
    }
    getTime(): string {
        return this.min1.toString() + this.min0.toString() + this.sec1.toString() + this.sec0.toString()
    }
    increment() {
        if (this.sec0 == 9) {
            this.sec0 = 0
            if (this.sec1 == 5) {
                this.sec1 = 0
                if (this.min0 == 9) {
                    this.min0 = 0
                    if (this.min1 == 9) {
                        this.min1 = 0
                        this.min0 = 0
                        this.sec1 = 0
                        this.sec0 = 0
                    } else {
                        this.min1++
                    }
                } else {
                    this.min0++
                }
            } else {
                this.sec1++
            }
        } else {
            this.sec0++
        }
    }
    showTime() {
        basic.clearScreen()
        this.displayCol(0, this.min1)
        this.displayCol(1, this.min0)
        this.displayCol(3, this.sec1)
        this.displayCol(4, this.sec0)
    }
    displayCol(col: number, time: number) {
        if (time > 7) {
            led.plot(col, 1)
            this.displayCol(col, time - 8)
        } else if (time > 3) {
            led.plot(col, 2)
            this.displayCol(col, time - 4)
        } else if (time > 1) {
            led.plot(col, 3)
            this.displayCol(col, time - 2)
        } else if (time == 1) {
            led.plot(col, 4)
        }
    }
}
let time = new clock()
let init: number, seconds, i = 0

input.onButtonPressed(Button.A, function () {
    time.setTime("0000")
    init = input.runningTimeMicros()
})

radio.onReceivedString(function (receivedString: string) {
    time.setTime(receivedString)
    init = input.runningTimeMicros()
})

input.onButtonPressed(Button.B, function () {
    radio.sendString(time.getTime())
})

basic.forever(function () {
    seconds = (input.runningTimeMicros() - init) / 1000
    if (seconds >= i) {
        time.increment()
        time.showTime()
        i += 1000
    }
})

radio.sendNumber(0)
