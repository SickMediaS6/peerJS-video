import { Injectable } from '@angular/core';
import Peer from 'peerjs';

@Injectable({
  providedIn: 'root'
})
// variables
export class WebrtcService {
  peer: Peer;
  myStream: MediaStream;
  myElement: HTMLMediaElement;
  partnerElement: HTMLMediaElement;

  constructor() {
  }

  // Get the video files
  getMedia() {
    navigator.getUserMedia({ audio: true, video: true }, (stream) => {
      this.successhandler(stream);
    }, (error) => {
      this.errorHandler(error);
    });
  }
  // waiting for event that peer id's match
  async init(userId: string, myElement: HTMLMediaElement, partnerElement: HTMLMediaElement) {
    this.myElement = myElement;
    this.partnerElement = partnerElement;
    try {
      this.getMedia();
    } catch (e) {
      this.errorHandler(e);
    }
    await this.makePeer(userId);
  }

  // create a peer id event
  async makePeer(userId: string) {
    this.peer = new Peer(userId);
    this.peer.on('open', () => {
      this.wait();
    });
  }
 // call to the partner event
  call(partnerId: string) {
    const call = this.peer.call(partnerId, this.myStream);
    call.on('stream', (stream) => {
      this.partnerElement.srcObject = stream;
    });
  }
// calls coming through
  wait() {
    this.peer.on('call', (call) => {
      call.answer(this.myStream);
      call.on('stream', (stream) => {
        this.partnerElement.srcObject = stream;
      });
    });
  }
// handler for success
  successhandler(stream: MediaStream) {
    this.myStream = stream;
    this.myElement.srcObject = stream;
  }

  errorHandler(error: any) {
    if (error.name === 'ConstraintNotSatisfiedError') {
      // const v = constraints.video; 
      // TODO: Fix HandleError - Now it breaks the whole code
      this.errorMsg('');
    } else if (error.name === 'PermissionDeniedError') {
      this.errorMsg('');
    }
    this.errorMsg(`getUserMedia error: ${error.name}`, error);
  }

  errorMsg(msg: string, error?: any) {
    const errorElement = document.querySelector('#errorMsg');
    errorElement.innerHTML += `<p>${msg}</p>`;
    if (typeof error !== 'undefined') {
      console.error(error);
    }
  }

}
