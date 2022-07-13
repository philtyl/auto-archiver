import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-sitelist',
  templateUrl: './sitelist.component.html',
  styleUrls: ['./sitelist.component.scss']
})
export class SitelistComponent implements OnInit {
  siteListForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private change: ChangeDetectorRef) {
    this.siteListForm = formBuilder.group({
      sitelist: ['']
    });
  }

  ngOnInit(): void {
    const storageKey = environment.storageKeys.siteList;
    chrome.storage.sync.get([storageKey], (result) => {
      console.debug(`Retrieving '${storageKey}': '${JSON.stringify(result[storageKey])}'`);
      if (!!result[storageKey]) {
        this.siteListForm.controls['sitelist'].setValue(result[storageKey].join('\n'));
        this.change.detectChanges();
      }
    });
  }

  onSubmit(): void {
    const storageKey = environment.storageKeys.siteList;
    const siteArray = this.siteListForm.controls['sitelist'].value.split(/\r?\n/);
    chrome.storage.sync.set({ [storageKey]: siteArray }, () => {
      console.debug(`Setting '${storageKey}': '${JSON.stringify(siteArray)}'`);
      window.close();
    });
  }
}
