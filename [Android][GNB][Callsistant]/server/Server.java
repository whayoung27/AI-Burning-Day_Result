import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.ArrayList;

// 서버 thread 기능
// (1) 클라이언트에서 보내오는 메시지를 지속적으로 수신
// (2) 모든 클라이언트에게 수신된 메시지를 전송
class ServerThread extends Thread {
	
	Socket server;
	InputStream is;
	OutputStream os;
	boolean isNotDone = true;
	
	public ServerThread(Socket server) throws IOException {
		this.server = server;
		is = server.getInputStream();
		os = server.getOutputStream();
	}
	
	public void run() {
		while (isNotDone) {
			// (1) 클라이언트에서 보내오는 메시지를 지속적으로 수신
			byte[] b = new byte[256];
			try {
				is.read(b);
				System.out.println(new String(b).trim());
			} catch (IOException e) {
				// 담당하는 클라이언트가 종료된 상황으로 간주
				// 현재 Thread도 종료
				System.out.println("메시지 수신 오류");
				e.printStackTrace();
				isNotDone = false;
			}
			
			// (2) 모든 클라이언트에게 수신된 메시지(byte[] b)를 전송
			// 모든 클라이언트에세 메시지를 보내기 위해 각 클라이언트와 연결된 소켓 필요
			// 모든 클라이언트에게 메세지를 송신하기 전까지는 다른 Thread가 접근하지 못한다
			synchronized (Server.total_socket) {
				for (Socket s:Server.total_socket) {
					try {
						s.getOutputStream().write(b);
					} catch (IOException e) {
						// 대상이 되는 클라이언트가 종료된 상황으로
						// 현재 소켓은 제거 대상
						// total_socket에 있는 현재 소켓 제거
						Server.total_socket.remove(s);
						System.out.println("메시지 송신 오류");
						e.printStackTrace();
					}
				}
			}
			
		}
	}
	
}

public class Server {
	
	// 각 Client와 연결된 소켓 저장
	static ArrayList<Socket> total_socket = new ArrayList<Socket>();
	
	
	public static void main(String[] args) throws IOException {
		
		System.out.println("[Server Start]");
		
		// Socket 객체 생성
		ServerSocket s = new ServerSocket(8888);
		
		while (true) {
			// (1)클라이언트의 접속을 대기  (2)클라이언트 접속시 매칭되는 Socket 생성
			Socket server = s.accept();	
			
			// 생성된 소켓 저장
			total_socket.add(server);
			
			// 현재 접속된 클라이언트를 담당할 Thread 생성 후 start
			new ServerThread(server).start();
			
		}
		
	}
	
}
