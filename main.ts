// Код передатчика (Sender) - Пульт управления (Адаптированная версия)

let lift_on = 0
radio.setGroup(228)
basic.showIcon(IconNames.Target)

// Управление подъёмным вентилятором по нажатию на логотип (без изменений)
input.onLogoEvent(TouchButtonEvent.Pressed, function () {
    if (lift_on == 0) {
        lift_on = 1
        radio.sendValue("lift", 1)
        basic.showLeds(`...`) // код иконки опущен
    } else {
        lift_on = 0
        radio.sendValue("lift", 0)
        basic.showIcon(IconNames.Target)
    }
})

// Управление поворотами (без изменений)
input.onButtonPressed(Button.A, function () {
    radio.sendValue("steer", 45)
    basic.showArrow(ArrowNames.West)
})
input.onButtonPressed(Button.B, function () {
    radio.sendValue("steer", 135)
    basic.showArrow(ArrowNames.East)
})
input.onButtonPressed(Button.AB, function () {
    radio.sendValue("steer", 90)
    basic.showArrow(ArrowNames.North)
})

// Аварийная остановка (без изменений)
input.onGesture(Gesture.Shake, function () {
    radio.sendValue("stop", 0)
    basic.showIcon(IconNames.Skull)
})

// В бесконечном цикле проверяем наклон для управления скоростью
basic.forever(function () {
    let pitch = input.acceleration(Dimension.Y)

    if (pitch < -150) {
        // Преобразуем значение наклона в диапазон скорости 0-1023, чтобы соответствовать драйверу
        let thrust_speed = pins.map(
            pitch,
            -200,
            -1023,
            200, // Начинаем с небольшой скорости, чтобы избежать рывков
            1023
        )
        radio.sendValue("thrust", thrust_speed)
    } else {
        // Если наклона нет, останавливаем маршевый двигатель
        radio.sendValue("thrust", 0)
    }
    basic.pause(50)
})