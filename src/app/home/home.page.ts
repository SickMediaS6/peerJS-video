import { Component, ElementRef } from '@angular/core';
import { WebrtcService } from '../providers/webrtc.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  topVideoFrame = 'partner-video';
  userId: string;
  partnerId: string;
  myElement: HTMLMediaElement;
  partnerElement: HTMLMediaElement;

  constructor(
    public webRTC: WebrtcService,
    public elRef: ElementRef
  ) {}

  init() {
    // assignment of elements
    this.myElement = this.elRef.nativeElement.querySelector('#my-video');
    this.partnerElement = this.elRef.nativeElement.querySelector('#partner-video');
    this.webRTC.init(this.userId, this.myElement, this.partnerElement);
  }
  // call partner
  call() {
    this.webRTC.call(this.partnerId);
    this.swapVideo('my-video');
  }
  // swap video mobile view overlay see both screens
  swapVideo(topVideo: string) {
    this.topVideoFrame = topVideo;
  }
}
