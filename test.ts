// Hier kann man Tests durchführen; diese Datei wird nicht kompiliert, wenn dieses Paket als Erweiterung verwendet wird.
sonnenbogen.init(DigitalPin.P0, 3)
basic.forever(function () {
    sonnenbogen.moveSun()
    basic.pause(500)
})
