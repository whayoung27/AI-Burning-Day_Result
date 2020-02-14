//
//  ViewController.swift
//  AiBurningDayTest
//
//  Copyright © 2020 Minseop Kim. All rights reserved.
//
import UIKit
import AVFoundation
import NaverSpeech
import Alamofire
import UserNotifications



/*네이버 클라우드 플랫폼 (https://www.ncloud.com/)에서 앱 등록을 한 후 발급받은 client id가 필요합니다.*/
let ClientID = "6xcuuaxojs"


class ViewController: UIViewController , AVAudioPlayerDelegate , AVAudioRecorderDelegate {

    
    // MARK: - init
    required init?(coder aDecoder: NSCoder) {
        /*
         *  NSKRecognizer를 초기화 하는데 필요한 NSKRecognizerConfiguration을 생성합니다.
         *  configuration의 EPD(End Point Detection)type의 default값은 auto 이므로 여기에서 따로 값을 setting하지 않아도 됩니다.
         */
        let configuration = NSKRecognizerConfiguration(clientID: ClientID)
        configuration?.canQuestionDetected = true
        self.speechRecognizer = NSKRecognizer(configuration: configuration)
        super.init(coder: aDecoder)
        self.speechRecognizer.delegate = self as NSKRecognizerDelegate
        
    }
    

    
    
    // MARK: -IBOutlet
    @IBOutlet weak var recordBTN: UIButton!
    @IBOutlet weak var textClear: UIButton!
    
    @IBOutlet weak var showText: UITextView!
    
    @IBOutlet weak var recognitionResultLabel: UILabel!
    
    @IBOutlet weak var alertTestButton: UIButton!
    
    

    // MARK: - property

    
    var soundRecorder : AVAudioRecorder!
    var soundPlayer : AVAudioPlayer!
    var playerItem : AVPlayerItem?
    

    
    fileprivate let speechRecognizer: NSKRecognizer
    fileprivate let languages = Languages()
    
    
    var fileName : String = "audioFule.m4a"
    var sendData = Data()
    var csrTimer: Timer?
    var alertTimer: Timer?
    var textStringBuffer: String = ""
    var audioClassification: Bool = false
    
    

    
    
    // MARK: -Override func
    override func viewDidLoad() {
        super.viewDidLoad()
        self.recognitionResultLabel.text =  "음성인식 준비완료"
        
        showText.layer.cornerRadius = 15
        textClear.layer.cornerRadius = 15
        
        UNUserNotificationCenter.current().requestAuthorization(options: [.alert,.sound], completionHandler: {didAllow,Error in })


        
        setupRecorder()



    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        
        if self.isViewLoaded && self.view.window == nil {
            self.view = nil
        }
    }
    
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()


    }
    
    // MARK: POST Function
    
    func postFunc() {
        
        let audioFilename = getDocumentsDirectory().appendingPathComponent(fileName)
        
        do {
            sendData = try Data(contentsOf: audioFilename)
        }catch{
            print("error")
        }
        
        // Alamofire upload part
        let url = URL(string: "http://127.0.0.1:5000/upload")!
        Alamofire.upload(multipartFormData: { multipartFormData in
            multipartFormData.append(self.sendData ,
                                   withName: "file",
                                   fileName: self.fileName,
                                   mimeType: self.fileName)
            },
            to: url,
            encodingCompletion: { encodingResult in
                switch encodingResult {
                        case .success(let upload, _, _):
                            upload.responseJSON { response in
                                debugPrint(response.result.value as Any)
                                if let soundResult = response.result.value{
                                    print(type(of: soundResult))
                                    let index = soundResult as! Int32
                                    if index == 8 || index == 1 {
                                        self.warringfAlertController(style: UIAlertController.Style.actionSheet)
                                        
                                        let content = UNMutableNotificationContent()

                                        content.title = "소리보다 : 경고음 감지!!"
                                        content.subtitle = "경고음이 감지되었습니다"
                                        content.body = "경고음이 감지되었습니다. 주변을 살피거나 음성인식 기능을 켜주세요"


                                        let trigger = UNTimeIntervalNotificationTrigger(timeInterval: 0.5, repeats:false)
                                        let request = UNNotificationRequest(identifier: "timerdone", content: content, trigger: trigger)

                                        UNUserNotificationCenter.current().add(request, withCompletionHandler: nil)
                                        UIDevice.vibrate()
                                    }
                                    print(index)

                                }
                            }
                        case .failure(let encodingError):
                                print(encodingError)
            }})
        

        
        
    }
    
    func workLocalSoundRecord (){
        if audioClassification == true {
            print("마이크 항시 작동 시작합니다.")
            soundRecorder.record()
            if let timer = alertTimer {
                if !timer.isValid {
                    alertTimer = Timer.scheduledTimer(timeInterval: 4, target: self, selector: #selector(alertTimerCallback), userInfo: nil, repeats: true)
                        }
                }else{
                alertTimer = Timer.scheduledTimer(timeInterval: 4, target: self, selector: #selector(alertTimerCallback), userInfo: nil, repeats: true)
            }
        
        } else {
            
            if soundRecorder.isRecording {
                soundRecorder.stop()
                print("마이크 항시 작동 중지합니다.")

            }
            if let timer = alertTimer {
                        if(timer.isValid){
                            timer.invalidate()
                        }
                    }
        }
    }
    


    
    // MARK: Record func
    //출처 : https://github.com/soonin/IOS-Swift-AudioRecorder01/blob/master/IOS-Swift-AudioRecorder01/ViewController.swift
    
    func getDocumentsDirectory() -> URL {
        let paths = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask)
        return paths[0]
    }
    
    func setupRecorder() {
        
        let audioFilename = getDocumentsDirectory().appendingPathComponent(fileName)
        let recordSetting = [ AVFormatIDKey : kAudioFormatAppleLossless,
                              AVEncoderAudioQualityKey : AVAudioQuality.max.rawValue,
                              AVEncoderBitRateKey : 320000,
                              AVNumberOfChannelsKey : 2,
                              AVSampleRateKey : 44100.2] as [String : Any]
        
        do {
            soundRecorder = try AVAudioRecorder(url: audioFilename, settings: recordSetting )
            soundRecorder.delegate = self
            soundRecorder.prepareToRecord()
        } catch {
            print(error)
        }
    }
    
    func setupPlayer() {
        let audioFilename = getDocumentsDirectory().appendingPathComponent(fileName)
        do {
            soundPlayer = try AVAudioPlayer(contentsOf: audioFilename)
            soundPlayer.delegate = self
            soundPlayer.prepareToPlay()
            soundPlayer.volume = 1.0
        } catch {
            print(error)
        }
    }
    
    
    

    
    
    // MARK: Action func
    
    @IBAction func clearText(_ sender: Any) {
        self.showText.text = ""
        textStringBuffer = ""
    }
    
    @IBAction func csrMicAct(_ sender: UIButton) {
    
        sender.isSelected = !sender.isSelected
        if sender.isSelected {
            try? AVAudioSession.sharedInstance().setCategory(.record)
            self.speechRecognizer.start(with: self.languages.selectedLanguage)
            
            
            // timer 출처 : https://ghj1001020.tistory.com/757
            if let timer = csrTimer {
                if !timer.isValid {
                    csrTimer = Timer.scheduledTimer(timeInterval: 0.5, target: self, selector: #selector(timerCallback), userInfo: nil, repeats: true)
                        }
                }else{

                csrTimer = Timer.scheduledTimer(timeInterval: 0.5, target: self, selector: #selector(timerCallback), userInfo: nil, repeats: true)
            }
        
        } else {
            self.speechRecognizer.stop()
            self.recognitionResultLabel.text =  "음성인식 준비완료"

            if let timer = csrTimer {
                        if(timer.isValid){
                            timer.invalidate()
                        }
                    }
        }
    }
    
    @IBAction func alertTestAct(_ sender: UIButton) {
        self.showAlertController(style: UIAlertController.Style.actionSheet)
        UIDevice.vibrate()

        
    }
    
    
    //MARK: TimerCallBack Func
    @objc func timerCallback(){
        if speechRecognizer.isRunning {
            print("okay")
        }else {
            self.speechRecognizer.start(with: self.languages.selectedLanguage)
        }
    }
    
    
    @objc func alertTimerCallback(){
        soundRecorder.stop()
        self.postFunc()
        soundRecorder.record()
    }

    
    func showAlertController(style: UIAlertController.Style) {
        
        let alert = UIAlertController(title: "경고음 감지모드를 작동시키겠습니까?", message: "마이크를 통해 주변 소리를 녹음하고 분석합니다.", preferredStyle: .alert)

        alert.addAction(UIAlertAction(title: "작동", style: .default, handler: {(alert: UIAlertAction!) in self.audioClassification = true
            self.workLocalSoundRecord()
            self.alertTestButton.isSelected = true

            }
        ))
        
        alert.addAction(UIAlertAction(title: "작동안함", style: .default, handler: {(alert: UIAlertAction!) in self.audioClassification = false
            self.workLocalSoundRecord()
            self.alertTestButton.isSelected = false

            }
        ))

        self.present(alert, animated: true)
        
    }
    
    
    func warringfAlertController(style: UIAlertController.Style) {
        UIDevice.vibrate()

        let warringAlert = UIAlertController(title: "경고음이 감지되었습니다.", message: "주변을 살피거나 음성인식 기능을 켜보세요!!", preferredStyle: .alert)
        warringAlert.addAction(UIAlertAction(title: "확인", style: .default, handler: {(alert: UIAlertAction!) in self.audioClassification = true} ))

        self.present(warringAlert, animated: true)
        
    }

    
}


/*
 * MARK: NSKRecognizerDelegate protocol 구현부
 */
extension ViewController: NSKRecognizerDelegate {
    
    public func recognizerDidEnterReady(_ aRecognizer: NSKRecognizer!) {
        print("Event occurred: Ready")
        
        self.recognitionResultLabel.text = "음성인식 중 입니다."
        self.recordBTN.isEnabled = true
    }
    
    public func recognizerDidDetectEndPoint(_ aRecognizer: NSKRecognizer!) {
        print("Event occurred: End point detected")
    }
    
    public func recognizerDidEnterInactive(_ aRecognizer: NSKRecognizer!) {
        print("Event occurred: Inactive")
        
        self.recordBTN.isEnabled = true
        try? AVAudioSession.sharedInstance().setCategory(AVAudioSession.Category.soloAmbient)
    }
    
    public func recognizer(_ aRecognizer: NSKRecognizer!, didRecordSpeechData aSpeechData: Data!) {
        print("Record speech data, data size: \(aSpeechData.count)")

    }
    
    public func recognizer(_ aRecognizer: NSKRecognizer!, didReceivePartialResult aResult: String!) {
        print("Partial result: \(String(describing: aResult))")

        self.recognitionResultLabel.text = aResult
        self.showText.text = textStringBuffer + aResult

    }
    
    public func recognizer(_ aRecognizer: NSKRecognizer!, didReceiveError aError: Error!) {
        print("Error: \(String(describing: aError))")

        self.recordBTN.isEnabled = true
        self.recognitionResultLabel.text = "Error: " + aError.localizedDescription
    }
    
    public func recognizer(_ aRecognizer: NSKRecognizer!, didReceive aResult: NSKRecognizedResult!) {
        print("Final result: \(String(describing: aResult))")
        if let result = aResult.results.first as? String {
//            self.recognitionResultLabel.text = "Result: " + result
            self.showText.text = textStringBuffer + "\n" + result
            textStringBuffer = self.showText.text
        }
    }
}



extension UIDevice {
    static func vibrate() {
        AudioServicesPlaySystemSound(kSystemSoundID_Vibrate)
    }
}
