import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
/*MODEL*/
import { ModalMoviments } from '../../shared/models/modal.model';
// SERVICES //
import { ComptesService } from './services/comptes.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-comptes',
  templateUrl: './comptes.component.html',
  styleUrls: ['./comptes.component.scss'],
})
export class ComptesComponent implements OnInit {
  @ViewChild('htmlData', { static: false }) htmlData: ElementRef;
  @ViewChild('month', { static: false })
  mesPicker: ElementRef<HTMLInputElement> = {} as ElementRef;
  public moviments: any[];
  public moviment: ModalMoviments;
  public form: FormGroup;
  public formSaldo: FormGroup;
  public selectedMoves: ModalMoviments[];
  public arrToDelete: any[] = [];
  public newDialog: boolean;
  public saldoDialog: boolean;
  public editDialog: boolean;
  public fecha: any;
  public submitted: boolean;
  public rb: any;
  public ref: DynamicDialogRef;
  public arrFiles: any[] = [];
  public formatedDate: any;
  public pickerMes;
  public month;
  public mes;
  public any;
  public saldo: any;
  public saldoAnt: any;
  public saldoID: any;
  columns = [
    { title: 'Concepte', dataKey: 'concepte' },
    { title: 'Data', dataKey: 'data' },
    { title: 'Import', dataKey: 'import' },
    { title: 'Descripcio', dataKey: 'descripcio' },
    { title: 'Tipus', dataKey: 'tipus' },
  ];

  constructor(
    private comptesService: ComptesService,
    public datepipe: DatePipe,
    public dialogService: DialogService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.pickerMes = new Date();
    this.pickerMes.setMonth(this.pickerMes.getMonth());
    this.monthPicker();
    this.mes = this.translateMonth(this.pickerMes);
    this.any = new Date().getFullYear();
    this.initForm();
    this.initTable(this.mes, this.any);
  }

  // APIS //
  getAllMoves() {
    this.comptesService.getMoviments().subscribe((moves) => {
      console.log(moves);
      this.moviments = moves.info_;
      return this.moviments.forEach((x) => {
        this.formatedDate = this.datepipe.transform(x.date, 'dd-MM-yyyy', 'en');
        x.date = this.formatedDate;
      });
    });
  }
  getMovesOfMonth() {
    let mes = this.monthPicker();
    let any = this.mesPicker['currentYear'];
    this.comptesService.getMovimentsDelMes(mes, any).subscribe((moves) => {
      console.log(moves);
      this.moviments = moves.info_;
      this.saldoAnt = moves.saldoAnt;
      return this.moviments.forEach((x) => {
        this.formatedDate = this.datepipe.transform(x.date, 'dd-MM-yyyy', 'en');
        x.date = this.formatedDate;
      });
    });
    this.getSaldo();
  }
  // SALDO //
  openSaldo(): void {
    this.form.reset();
    this.saldoDialog = true;
    this.submitted = false;
  }
  closeSaldoDialog() {
    this.saldoDialog = false;
    this.submitted = false;
  }
  getSaldo() {
    this.comptesService.getSaldo().subscribe((data) => {
      this.saldo = data.info_[0][0].quantitat.$numberDecimal;
      this.saldoID = data.info_[0][0]._id;
    });
  }
  setSaldo() {
    this.submitted = true;
    let quantitat = this.formSaldo.value;
    let id = this.saldoID;
    try {
      if (this.formSaldo.valid) {
        console.log('entra');
        this.comptesService.updateSaldo(id, quantitat);
        this.getSaldo();

        this.saldoDialog = false;
        this.submitted = false;
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
    this.getSaldo();
  }
  // CREATE //
  openNew(): void {
    this.form.reset();
    this.newDialog = true;
    this.submitted = false;
  }
  createMove(): void {
    this.submitted = true;
    try {
      if (this.form.valid) {
        this.comptesService
          .createMovement(
            this.form.value,
            this.parseMonthToCreate(this.form.value.date)
          )
          .subscribe((data) => {
            this.getMovesOfMonth();
          });
        this.newDialog = false;
        this.submitted = false;
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
  closeCreateDialog(): void {
    this.newDialog = false;
    this.editDialog = false;
    this.submitted = false;
  }
  // UPDATE //
  openEditDialog(move: any) {
    const oldForm = move;
    this.form = this.fb.group({
      concepte: [oldForm.concepte],
      date: oldForm.date,
      descripcio: [oldForm.descripcio],
      import: [oldForm.import],
      tipus: [oldForm.tipus],
      estado: [oldForm.estado],
      total: [oldForm.total],
      _id: [oldForm._id],
    });
    this.submitted = false;
    this.editDialog = true;
  }
  editMove(move: any) {
    try {
      if (this.form.valid) {
        this.submitted = true;
        const id = move._id;
        this.comptesService.updateMovement(id, move);
        this.getMovesOfMonth();
        this.editDialog = false;
        this.submitted = false;
        this.getSaldo();
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
    this.getSaldo();
    this.getMovesOfMonth();
  }
  // DELETE //
  deleteMove(data: any) {
    this.submitted = true;
    try {
      const id = data._id;
      this.comptesService.deleteMovement(id).subscribe((data) => {});
      this.submitted = false;
    } catch (error) {
      console.log(error);
    }

    this.getMovesOfMonth();
    this.getSaldo();
    this.getActualDate();
  }
  async deleteSelectedMoves() {
    this.confirmationService.confirm({
      message: 'Segur que vol esborrar aquests moviments?',
      header: 'Atenció!',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Acceptar',
      rejectLabel: 'Cancel·lar',
      accept: () => {
        try {
          this.selectedMoves.forEach((x) => {
            this.arrToDelete.push({ id: x._id });
          });
          this.comptesService
            .deleteMovements(this.arrToDelete)
            .subscribe((data) => {
              console.log(data);
            });
          this.messageService.add({
            severity: 'success',
            summary: 'Correcte',
            detail: 'Moviments esborrats',
            life: 3000,
          });
          this.selectedMoves = [];
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      },
    });
  }
  // PRIVATE //
  public initForm(): void {
    this.form = this.fb.group({
      concepte: new FormControl('', [Validators.required]),
      import: new FormControl('', [Validators.required]),
      tipus: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      descripcio: new FormControl('', [Validators.required]),
    });
    this.formSaldo = this.fb.group({
      saldo: new FormControl('', [Validators.required]),
    });
  }
  get f(): any {
    return this.form.controls;
  }
  public resetForm(): void {
    this.form.reset();
  }
  public monthPicker() {
    if (this.mesPicker['inputFieldValue'] === 'January') {
      return 'enero';
    } else if (this.mesPicker['inputFieldValue'] === 'February') {
      return 'febrero';
    } else if (this.mesPicker['inputFieldValue'] === 'March') {
      return 'marzo';
    } else if (this.mesPicker['inputFieldValue'] === 'April') {
      return 'abril';
    } else if (this.mesPicker['inputFieldValue'] === 'May') {
      return 'mayo';
    } else if (this.mesPicker['inputFieldValue'] === 'June') {
      return 'junio';
    } else if (this.mesPicker['inputFieldValue'] === 'July') {
      return 'julio';
    } else if (this.mesPicker['inputFieldValue'] === 'August') {
      return 'agosto';
    } else if (this.mesPicker['inputFieldValue'] === 'September') {
      return 'septiembre';
    } else if (this.mesPicker['inputFieldValue'] === 'October') {
      return 'octubre';
    } else if (this.mesPicker['inputFieldValue'] === 'November') {
      return 'noviembre';
    } else {
      return 'diciembre';
    }
  }
  public translateMonth(data) {
    let month = data.toLocaleString('en-us', { month: 'short' });
    if (month === 'Jan') {
      return 'enero';
    } else if (month === 'Feb') {
      return 'febrero';
    } else if (month === 'Mar') {
      return 'marzo';
    } else if (month === 'Apr') {
      return 'abril';
    } else if (month === 'May') {
      return 'mayo';
    } else if (month === 'Jun') {
      return 'junio';
    } else if (month === 'Jul') {
      return 'julio';
    } else if (month === 'Aug') {
      return 'agosto';
    } else if (month === 'Sept') {
      return 'septiembre';
    } else if (month === 'Oct') {
      return 'octubre';
    } else if (month === 'Nov') {
      return 'noviembre';
    } else {
      return 'diciembre';
    }
  }
  public parseMonthToCreate(date) {
    let month = date.substring(5, 7);
    if (month === '01') {
      return 'enero';
    } else if (month === '02') {
      return 'febrero';
    } else if (month === '03') {
      return 'marzo';
    } else if (month === '04') {
      return 'abril';
    } else if (month === '05') {
      return 'mayo';
    } else if (month === '06') {
      return 'junio';
    } else if (month === '07') {
      return 'julio';
    } else if (month === '08') {
      return 'agosto';
    } else if (month === '09') {
      return 'septiembre';
    } else if (month === '10') {
      return 'octubre';
    } else if (month === '11') {
      return 'noviembre';
    } else {
      return 'diciembre';
    }
  }
  public initTable(mes, any) {
    this.comptesService.getMovimentsDelMes(mes, any).subscribe((moves) => {
      this.moviments = moves.info_;
      this.getSaldo();
      return this.moviments.forEach((x) => {
        this.formatedDate = this.datepipe.transform(x.date, 'dd-MM-yyyy', 'en');
        x.date = this.formatedDate;
      });
    });
  }
  public getActualDate() {
    console.log(this.mesPicker);
    const d = new Date();
    this.pickerMes = d;
    let month = d.toLocaleString('en-us', { month: 'short' });
    let any = d.getFullYear();
    console.log(month);
    let mes = this.translateMonth(month);
    console.log(mes);
    console.log(any);
    this.comptesService.getMovimentsDelMes(mes, any).subscribe((moves) => {
      console.log(moves);
      this.moviments = moves.info_;
      return this.moviments.forEach((x) => {
        this.formatedDate = this.datepipe.transform(x.date, 'dd-MM-yyyy', 'en');
        x.date = this.formatedDate;
      });
    });
    this.getSaldo();
  }

  public exportPdf() {
    const doc = new jsPDF('p', 'pt');
    console.log(this.moviments);

    autoTable(doc, {
      columns: this.columns,
      body: this.moviments,
      didDrawPage: (data) => {
        console.log(data);
        doc.text(
          'Moviments ' + this.mes + ' ' + this.any,
          data.settings.margin.left,
          10
        );
        var today = new Date();
        var newdat = 'Date Printed : ' + today;
      },
    });

    doc.save(`moviments-${this.mes}-${this.any}.pdf`);
  }
}
