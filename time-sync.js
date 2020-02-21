class clock {
    min1: number
    min0: number
    sec1: number
    sec0: number
    constructor() { }
    setTime(timeIn: string) {
        //sets time by parsing the input string and converting to numbers
        this.min1 = parseInt(timeIn.charAt(0))
        this.min0 = parseInt(timeIn.charAt(1))
        this.sec1 = parseInt(timeIn.charAt(2))
        this.sec0 = parseInt(timeIn.charAt(3))
    }
    getTime(): string {
        //returns time as a string
        return this.min1.toString() + this.min0.toString() + this.sec1.toString() + this.sec0.toString()
    }
    increment() {
        //increments the time values: 99 minutes, 59 seconds
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
        //clears screen, displays each column with current time
        basic.clearScreen()
        this.displayCol(0, this.min1)
        this.displayCol(1, this.min0)
        this.displayCol(3, this.sec1)
        this.displayCol(4, this.sec0)
    }
    //displays a column by plotting the led, then calling itself for remaining bits
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
let time = new clock() //clock object
//variables to track the timing
let init = input.runningTimeMicros(), seconds, i = 0
//enumerate roles
enum role {
    master,
    slave,
    unassigned,
}
let action = role.unassigned //default to unassigned

input.onButtonPressed(Button.A, function () {
    //only the master or unassigned can reset time
    if (action == role.unassigned || action == role.master) {
        action = role.master
        //basic.pause(50)
        radio.sendNumber(0)
        basic.clearScreen()
        time.setTime("0000")
    }
})

function masterConflict() {
    //runs if two microbits are set to master, unassigns both
    action = role.unassigned
    basic.showString("Conflict!")
}

radio.onReceivedNumber(function (receivedNumber: number) {
    //sets the roles of each microbit, checks for conflicting roles (>1 master)
    if (receivedNumber == 0 && action == role.master) {
        masterConflict()
        radio.sendNumber(1)
    } else if (receivedNumber == 0) {
        action = role.slave
    } else if (receivedNumber == 1) {
        masterConflict()
    }
})

radio.onReceivedString(function (receivedString: string) {
    //sets time to the value of the recieved time
    time.setTime(receivedString)
})

input.onButtonPressed(Button.B, function () {
    //the master can update the slave via B-press
    if (action == role.master) radio.sendString(time.getTime())
})

basic.forever(function () {
    seconds = (input.runningTimeMicros() - init) / 100000
    if (seconds >= i) {
        time.increment()
        time.showTime()
        i++
        if (i % 30 == 0 && action == role.master) {
            radio.sendNumber(0)
            radio.sendString(time.getTime())
        }
    }
})

radio.sendNumber(-1) //allows the simulator to display two microbits
