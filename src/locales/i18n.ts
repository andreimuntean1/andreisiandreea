import { createI18n } from "vue-i18n";

export type Language = "ro" | "en" | "uk";

export const i18n = createI18n({
  locale: "ro",
  legacy: false,
  messages: {
    ro: {
      message: {
        hero: "Andrei și Andreea",
        review: {
          heading: "Ți-a plăcut?",
          text: "Scrie-ne cum ți s-a părut la nuntă, un gând frumos sau o urare.",
        },
        media: {
          heading: "Ai făcut poze?",
          text: "Ne-ar plăcea mult să vedem cum a arătat ziua nunții noastre din perspectiva ta. Poți încărca aici toate pozele și video-urile pe care vrei să le împărtășești cu noi.",
          helper: "Apasă aici ca să încarci fișiere",
          success: "Fișierele au fost încărcate cu succes",
        },
        name: {
          heading: "Cine ești?",
          text: "Am vrea să știm cine ne-a lăsat aceste cuvinte frumoase și amintiri neprețuite. Scrie-ți mai jos numele tău.",
        },
        placeholder: "Scrie aici",
        buttonText: "Gata",
        thankYou: {
          heading: "Mulțumim!",
          text: "Îți mulțumim că ți-ai făcut timp să împărtășești cu noi câteva gânduri și poze. Dar mai mult, îți mulțumim că ai ales să fii alături de noi la începutul vieții noastre ca familie. Te iubim foarte mult!",
          uploading: "Se trimite...",
          success: "Gândurile și pozele au fost trimise cu succes spre miri",
        },
        error: {
          noName:
            "Ne-ar plăcea să știm cine ne trimite aceste amintiri prețioase. Te rugăm să-ți treci numele",
          noBothNames: "Te rugăm să îți treci numele și prenumele",
          noContent: "Te rugăm să ne lași un mesaj sau să încarci poze",
        },
      },
    },
    en: {
      message: {
        hero: "Andrei and Andreea",
        review: {
          heading: "Did you enjoy it?",
          text: "Tell us how the wedding felt to you — share a kind thought or a wish.",
        },
        media: {
          heading: "Did you take any photos?",
          text: "We'd love to see how our wedding day looked through your eyes. You can upload here any photos or videos you'd like to share with us.",
          helper: "Click here to upload files",
          success:
            "Your message and photos were successfully sent to the couple",
        },
        name: {
          heading: "Who are you?",
          text: "We'd love to know who left us these beautiful words and priceless memories. Please write your name below.",
        },
        placeholder: "Write here...",
        buttonText: "Done",
        thankYou: {
          heading: "Thank you!",
          text: "Thank you for taking the time to share some thoughts and photos with us. But most of all, thank you for choosing to be with us at the beginning of our life as a family. We love you so much!",
          uploading: "Uploading...",
          success:
            "Your message and photos were successfully sent to the couple",
        },
        error: {
          noName:
            "We'd love to know who's sending us these precious memories. Please enter your name",
          noBothNames: "Please enter both your first and last name",
          noContent: "Please leave us a message or upload some photos",
        },
      },
    },
    uk: {
      message: {
        hero: "Андрій та Андрея",
        review: {
          heading: "Вам сподобалося?",
          text: "Розкажіть нам, яким було ваше враження від весілля — поділіться гарною думкою або побажанням.",
        },
        media: {
          heading: "Ви зробили фото?",
          text: "Нам би дуже хотілося побачити, як виглядав наш весільний день вашими очима. Ви можете завантажити тут усі фотографії та відео, які хочете поділитися з нами.",
          helper: "Натисніть тут, щоб завантажити файли",
          success: "Ваше повідомлення та фото успішно надіслані молодятам",
        },
        name: {
          heading: "Хто ви?",
          text: "Нам цікаво дізнатися, хто залишив ці прекрасні слова та безцінні спогади. Будь ласка, впишіть своє ім’я нижче.",
        },
        placeholder: "Напишіть тут...",
        buttonText: "Готово",
        thankYou: {
          heading: "Дякуємо!",
          text: "Дякуємо, що знайшли час поділитися з нами своїми думками та фотографіями. Але понад усе — дякуємо, що були поруч із нами на початку нашого спільного життя як сім’ї. Ми вас дуже любимо!",
          uploading: "Завантаження...",
          success: "Ваше повідомлення та фото успішно надіслані молодятам",
        },
        error: {
          noName:
            "Нам би хотілося знати, хто надсилає нам ці цінні спогади. Будь ласка, введіть своє ім’я",
          noBothNames: "Будь ласка, введіть своє ім’я та прізвище",
          noContent: "Будь ласка, залиште повідомлення або завантажте фото",
        },
      },
    },
  },
});
