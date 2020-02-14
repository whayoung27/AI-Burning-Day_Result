package com.example.kioskforelders.csr

import java.io.File
import java.io.FileNotFoundException
import java.io.FileOutputStream
import java.io.IOException
import java.nio.ByteBuffer
import java.nio.ByteOrder

class AudioWriterPCM  (path: String){

    var path: String? = path
    var filename: String? = null
    var speechFile: FileOutputStream? = null

    /**녹음 파일의 이름을 결정해주고 이 녹음 파일을 FileOutputStream 으로 생성시켜주는 함수*/
    fun open(sessionId: String) {
        val directory = File(path)
        if (!directory.exists()) {
            directory.mkdirs()
        }

        filename = "$directory/$sessionId.pcm"
        try {
            speechFile = FileOutputStream(File(filename))
        } catch (e: FileNotFoundException) {
            System.err.println("Can't open file : $filename")
            speechFile = null
        }

    }

    /** 녹음 파일 닫아주는 함수 */
    fun close() {
        if (speechFile == null)
            return

        try {
            speechFile?.close()
        } catch (e: IOException) {
            System.err.println("Can't close file : $filename")
        }

    }

    /** open() 으로 생성한 녹음파일을 write 해주는 함수 */
    fun write(data: ShortArray) {
        if (speechFile == null)
            return

        val buffer = ByteBuffer.allocate(data.size * 2)
        buffer.order(ByteOrder.LITTLE_ENDIAN)
        for (i in data.indices) {
            buffer.putShort(data[i])
        }
        buffer.flip()

        try {
            speechFile?.write(buffer.array())
        } catch (e: IOException) {
            System.err.println("Can't write file : $filename")
        }

    }


}