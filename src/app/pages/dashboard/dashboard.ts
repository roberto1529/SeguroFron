import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { EndPointService } from './services/endpoint.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';

@Component({
    selector: 'app-dashboard',
    imports: [TableModule, ButtonModule, IconFieldModule, InputTextModule,InputIconModule, ReactiveFormsModule, CommonModule],
    templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {

    loading: boolean = true;
    @ViewChild('dt2') dt2!: Table;
    usuarios!: any[];
    private formBuilder = inject(FormBuilder);
    errorMessages: Record<string, string> = {
        required: 'El campo es obligatorio',
        whitespace: 'No se permiten espacios en blanco',
        minlength: 'Mínimo 8 caracteres',
        email: 'El correo no es válido',
        firstLetterUppercase: 'La primera letra debe ser mayúscula',
        uppercaseStart: 'La contraseña debe comenzar con mayúscula',
        requiresNumber: 'Debe contener al menos un número',
        requiresSpecialChar: 'Debe incluir al menos un carácter especial',
    };

    form = this.formBuilder.group({
        id: [''],
        buscar: [''],
        nombre: ['', [
            Validators.required,
            Validators.minLength(3),

        ]],
        papellido: ['', [
            Validators.required,
            Validators.minLength(3),
        ]],
        sapellido: ['', [
            Validators.required,
            Validators.minLength(3),
            //   CustomValidators.noWhitespaceValidator,
            //   CustomValidators.firstLetterUppercase
        ]],
        pass: ['', [
            Validators.required,
            Validators.minLength(8),
        ]],
        passcryto: [''],
        correo: ['', [Validators.required, Validators.email]],
        rol: ['', Validators.required],
        usuario: [''],
        estado: [false]
    });

    constructor(private endp: EndPointService){}

    ngOnInit(): void {
        this.getData()
    }

    private getData() : void {
        this.endp.getAll().subscribe((res : any)=>{
            console.log(res);
            this.loading = false;
            this.usuarios = res;
        })
    }

    public mensajeError(campo: string, error: string): boolean {
        const control = this.form.get(`${campo}`);
        return (
            control! && control.hasError(error) && (control.dirty || control.touched)
        );
    }

    getFieldErrors(fieldName: string): string[] {
        const control = this.form.get(fieldName);
        if (!control || !control.errors || (!control.touched && !control.dirty)) return [];

        return Object.keys(control.errors)
            .filter(error => this.errorMessages[error])
            .map(error => this.errorMessages[error]);
    }

    
  clear(table: Table) {
    table.clear();
    this.form.reset();
  }

  searchGlobal(event: Event) {
    const input = event.target as HTMLInputElement;
    this.dt2.filterGlobal(input.value, 'contains');
  }


}
