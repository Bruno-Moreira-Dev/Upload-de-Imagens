import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  selectedFile: File = null;

  public imagePath;
  imgURL: any;
  public message: string;

  constructor(private http: HttpClient) { }

  onFileSelected(event, files): any {
    this.selectedFile = (event.target.files[0] as File);

    if (files.lenght === 0) {
      return;
    }
    const mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = 'Somente imagens são suportadas.';
      return;
    }

    const reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]);
    reader.onload = (events) => {
      this.imgURL = reader.result;
    };
  }

  onUpload(): any {
    const fd = new FormData();
    fd.append('image', this.selectedFile, this.selectedFile.name);
    this.http.post('http://localhost:3000/file', fd, {
      reportProgress: true,
      observe: 'events'
    })
      .subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          console.log('Upload Progress: ' + Math.round(event.loaded / event.total * 100) + '%');
        } else if (event.type === HttpEventType.Response) {
          console.log(event);
        }
      });
  }

}
