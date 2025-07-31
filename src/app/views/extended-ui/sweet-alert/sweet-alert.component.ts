import { Component } from '@angular/core';
import Swal from 'sweetalert2'
import { PageTitleComponent } from "@components/page-title.component";

@Component({
  selector: 'app-sweet-alert',
  standalone: true,
  imports: [PageTitleComponent],
  templateUrl: './sweet-alert.component.html',
  styles: ``
})
export class SweetAlertComponent {
  basicMessage() {
    Swal.fire({
      title: 'Any fool can use a computer',
      customClass: {
        confirmButton: 'btn btn-primary w-xs mt-2',
      },
      buttonsStyling: false,
      showCloseButton: false,
    })
  }

  titleText() {
    Swal.fire({
      title: 'The Internet?',
      text: 'That thing is still around?',
      icon: 'question',
      customClass: {
        confirmButton: 'btn btn-primary w-xs mt-2',
      },
      buttonsStyling: false,
      showCloseButton: false,
    })
  }

  htmlContent() {
    Swal.fire({
      title: '<i>HTML</i> <u>example</u>',
      icon: 'info',
      html: 'You can use <b>bold text</b>, ' +
        '<a href="#">links</a> ' +
        'and other HTML tags',
      showCloseButton: true,
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-success me-2',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
      confirmButtonText: '<i class="ti ti-thumb-up-filled me-1"></i> Great!',
      cancelButtonText: '<i class="ti ti-thumb-down-filled"></i>',
    })
  }

  info() {
    Swal.fire({
      text: "Here's an example of an info SweetAlert!",
      icon: "info",
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-info"
      }
    })
  }

  warning() {
    Swal.fire({
      text: "Here's an example of a warning SweetAlert!",
      icon: "warning",
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-warning"
      }
    })
  }

  error() {
    Swal.fire({
      text: "Here's an example of an error SweetAlert!",
      icon: "error",
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-danger"
      }
    })
  }

  success() {
    Swal.fire({
      text: "Here's an example of a success SweetAlert!",
      icon: "success",
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-success"
      }
    })
  }

  primary() {
    Swal.fire({
      text: "Here's an example of a question SweetAlert!",
      icon: "question",
      buttonsStyling: false,
      confirmButtonText: "Ok, got it!",
      customClass: {
        confirmButton: "btn btn-primary"
      }
    })
  }

  longContent() {
    Swal.fire({
      imageUrl: 'https://placeholder.pics/svg/300x1500',
      imageHeight: 1500,
      imageAlt: 'A tall image',
      customClass: {
        confirmButton: 'btn btn-primary mt-2',
      },
      buttonsStyling: false,
      showCloseButton: true
    })
  }

  confirm() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-primary me-2 mt-2',
        cancelButton: 'btn btn-danger mt-2',
      },
      confirmButtonText: "Yes, delete it!",
      buttonsStyling: false,
      showCloseButton: true
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary mt-2',
          },
          buttonsStyling: false
        })
      }
    });
  }

  cancel() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
      customClass: {
        confirmButton: 'btn btn-primary me-2 mt-2',
        cancelButton: 'btn btn-danger mt-2',
      },
      buttonsStyling: false,
      showCloseButton: true
    }).then(function (result) {
      if (result.value) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
          customClass: {
            confirmButton: 'btn btn-primary mt-2',
          },
          buttonsStyling: false
        })
      } else if (
        // Read more about handling dismissals
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire({
          title: 'Cancelled',
          text: 'Your imaginary file is safe :)',
          icon: 'error',
          customClass: {
            confirmButton: 'btn btn-primary mt-2',
          },
          buttonsStyling: false
        })
      }
    })
  }

  imageAlert() {
    Swal.fire({
      title: 'Sweet!',
      text: 'Modal with a custom image.',
      imageUrl: 'assets/images/logo-sm.png',
      imageHeight: 40,
      customClass: {
        confirmButton: 'btn btn-primary mt-2',
      },
      buttonsStyling: false,
      // animation: false,
      showCloseButton: true
    })
  }

  autoClose() {
    Swal.fire({
      title: 'Auto close alert!',
      html: 'I will close in <strong></strong> seconds.',
      timer: 2000,
      timerProgressBar: true,
      showCloseButton: true,
    })
  }

  topStart() {
    Swal.fire({
      position: 'top-start',
      icon: 'success',
      text: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    })
  }

  topEnd() {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      text: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    })
  }

  bottomStart() {
    Swal.fire({
      position: 'bottom-start',
      icon: 'success',
      text: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    })
  }

  bottomEnd() {
    Swal.fire({
      position: 'bottom-end',
      icon: 'success',
      text: 'Your work has been saved',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        confirmButton: 'btn btn-primary'
      },
      buttonsStyling: false
    })
  }

  customAlert() {
    Swal.fire({
      title: 'Custom width, padding, background.',
      width: 600,
      padding: 100,
      customClass: {
        confirmButton: 'btn btn-primary',
      },
      buttonsStyling: false,
      background: 'var(--osen-secondary-bg) url(assets/images/small/small-5.jpg) no-repeat center'
    })
  }

  ajax() {
    Swal.fire({
      title: 'Submit email to run ajax request',
      input: 'email',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      showLoaderOnConfirm: true,
      customClass: {
        confirmButton: 'btn btn-primary me-2',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
      showCloseButton: true,
      preConfirm: function (email) {
        return new Promise(function (resolve, reject) {
          setTimeout(function () {
            if (email === 'taken@example.com') {
              reject('This email is already taken.')
            } else {
              resolve(email)
            }
          }, 2000)
        })
      },
      allowOutsideClick: false
    }).then(function (email) {
      Swal.fire({
        icon: 'success',
        title: 'Ajax request finished!',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
        buttonsStyling: false,
        html: 'Submitted email: ' + email
      })
    })
  }
}
