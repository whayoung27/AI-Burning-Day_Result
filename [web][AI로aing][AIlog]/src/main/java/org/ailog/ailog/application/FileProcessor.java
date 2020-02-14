package org.ailog.ailog.application;

import java.io.File;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.sound.sampled.AudioFileFormat;
import javax.sound.sampled.AudioFileFormat.Type;
import javax.sound.sampled.AudioFormat;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;

import org.springframework.stereotype.Component;

@Component
public class FileProcessor {

	public List<File> splitFiles(String fileName) {
		List<File> files = new ArrayList<>();
		AudioInputStream audioInputStream = null;
		File source = new File(fileName);

		try {
			AudioFileFormat fileFormat = null;
			try {
				fileFormat = AudioSystem.getAudioFileFormat(source);
			} catch (Exception e) {
				// wav 파일이 아닌 경우 그냥 파일 반환.
				files.add(new File(fileName));
				return files;
			}


			AudioFormat format = fileFormat.getFormat();
			audioInputStream = AudioSystem.getAudioInputStream(source);

			long length = audioInputStream.getFrameLength();
			long frameRate = (long) audioInputStream.getFormat().getFrameRate();
			int bytesPerSeconds = format.getFrameSize();
			audioInputStream.close();

			AudioInputStream subFrame = null;

			int count = 10;
			for (long i = 0; i < length; i += (10 * frameRate)) {
				long skip = i * bytesPerSeconds;
				audioInputStream = AudioSystem.getAudioInputStream(source);
				audioInputStream.skip(skip);

				long toCopy = (count * (int)format.getFrameRate()) - i;
				subFrame = new AudioInputStream(audioInputStream, format, toCopy);

				// create sub files
				File file = new File(count + fileName);
				AudioSystem.write(subFrame, Type.WAVE, file);

				files.add(file);
				audioInputStream.close();
				count += 10;
			}

			return files;
		} catch (Exception e) {
			e.printStackTrace();
			System.out.println(e);
			return Collections.emptyList();
		}
	}
}
