import { Component, OnInit , Input} from '@angular/core';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

//services
import { OrderService } from 'src/app/core/services/home/order.service';
import { OrderDetailsService } from 'src/app/core/services/home/order-details.service';
import { PaymentService } from 'src/app/core/services/home/payment.service';

@Component({
  selector: 'app-boleta',
  templateUrl: './boleta.component.html',
  styleUrls: ['./boleta.component.css']
})
export class BoletaComponent implements OnInit {
  @Input() idPedido: any;

  //variables
  orderInfo: any = [];
  orderDetailInfo: any = [];
  paymentInfo: any = [];
  
  constructor(private router: Router,
    private orderService: OrderService,
    private orderDetailsService: OrderDetailsService,
    private paymentService: PaymentService) { }

  ngOnInit(): void {
    this.ListPedidoByID();
    this.ListOrderDetails();
    this.ListPaymentInfo();
  }

  DownloadPDF(): void {
    const DATA: any = document.getElementById('invoice');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 3
    };

    html2canvas(DATA, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save('boleta.pdf');
    });
  }

  ListPedidoByID() {
    this.orderService.GetById(this.idPedido).subscribe(r => {
      this.orderInfo = r.response;
    });
  }

  ListOrderDetails() {
    this.orderDetailsService.Get(this.idPedido).subscribe(r => {
      this.orderDetailInfo = r.response;
    });
  }

  ListPaymentInfo() {
    this.paymentService.GetByIdPedido(this.idPedido).subscribe(r => {
      this.paymentInfo = r.response[0];
    });
  }

}
