import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Table, TableModule } from 'primeng/table';
import { EndPointService } from './services/endpoint.service';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';

@Component({
    selector: 'app-dashboard',
    imports: [TableModule, ButtonModule, IconFieldModule, InputTextModule, InputIconModule,
        ReactiveFormsModule, CommonModule, DialogModule, DatePickerModule, TextareaModule],
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
    TituloForm: string = 'Crear'
    visible = false;
    form = this.formBuilder.group({
        buscar: [''],
        numeroIdentificacion: ['', [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(12)
        ]],
        primerNombre: ['', [
            Validators.required,
            Validators.minLength(3)
        ]],
        segundoNombre: [''], // No es requerido
        primerApellido: ['', [
            Validators.required,
            Validators.minLength(3)
        ]],
        segundoApellido: ['', [
            Validators.required,
            Validators.minLength(3)
        ]],
        telefonoContacto: ['', [
            Validators.required
        ]],
        email: ['', [
            Validators.required,
            Validators.email
        ]],
        fechaNacimiento: [null as Date | null, Validators.required],
        valorEstimadoSeguro: [0, [
            Validators.required
        ]],
        observaciones: ['']

    });

    constructor(private endp: EndPointService) { }

    ngOnInit(): void {
        this.getData()
    }

    private getData(): void {
        this.endp.getAll().subscribe((res: any) => {
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


    formModal(titulo: string, data?: any): void {
        console.log(data, titulo);

        this.TituloForm = titulo;
        this.visible = !this.visible;
        if (titulo === 'Editar') {

            setTimeout(() => {
                this.form.patchValue({
                    numeroIdentificacion: data.numeroIdentificacion,
                    primerNombre: data.primerNombre,
                    segundoNombre: data.segundoNombre,
                    primerApellido: data.primerApellido,
                    segundoApellido: data.segundoApellido,
                    telefonoContacto: data.telefonoContacto,
                    email: data.email,
                    fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : null, // Convertir a Date
                    valorEstimadoSeguro: data.valorEstimadoSeguro,
                    observaciones: data.observaciones
                });
            }, 0);
        } else {
            this.form.reset();
        }

    }

    onCrear() {
        this.endp.SetUser(this.form.value).subscribe((res: any) => {
            console.log('response', res)
            this.visible = false;
            this.getData();
        })
    }

    onEditar() {
        if (this.form.invalid) {
            console.log('Formulario inválido');
            return;
        }

        const datos: any = this.form.value;

        if (datos.numeroIdentificacion.length !== 12) {
            console.error('El número de identificación debe tener exactamente 12 caracteres.');
            return;
        }

        this.endp.PutUser(this.form.value, datos.numeroIdentificacion).subscribe((res: any) => {
            console.log('edite res', res);
            this.visible = false;
            this.getData();
        });

    }

    onDelete(data?: any) {

        this.endp.DelUser(data.numeroIdentificacion).subscribe((res: any) => {
            console.log('edite res', res);
            this.visible = false;
            this.getData();
        });

    }
}
