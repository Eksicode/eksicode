import Button from "@components/Ui/Button";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

interface SignUpValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  userAgreement: boolean;
}

const SignUpForm: React.FC = () => {
  const initialValues: SignUpValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    userAgreement: false
  };

  const validationSchema = Yup.object({
    username: Yup.string()
      .matches(/^\S*$/, "Kullanıcı adında boşluk olmamalıdır")
      .matches(/^\w*$/, "Kullanıcı adında özel karakter olmamalıdır")
      .required("Kullanıcı adı gereklidir"),
    email: Yup.string()
      .email("Geçerli bir e-posta adresi girin")
      .required("E-posta adresi gereklidir"),
    password: Yup.string()
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Şifreniz: En az 8 Karakter, Bir Buyük Harf, Bir Kuçük Harf, Bir Sayı ve Bir Özel Karakter içermelidir"
      )
      .required("Şifre gereklidir"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), undefined], "Sifreler uyusmuyor")
      .required("Sifre tekrarı gereklidir"),
    userAgreement: Yup
      .bool()
      .default(false)
      .required('Required')
      .oneOf([true],
      "Kullanıcı sözleşmesi gereklidir"
    ),
  });

  const handleSubmit = (values: SignUpValues) => {
    // Handle form submission here
    console.log(values);
  };

  return (
    <div className="w-5/6 m-10 flex justify-center">
      <div className="flex justify-center items-center flex-wrap md:w-8/12 lg:w-6/12 xl:w-4/12 2xl:w-4/12 lg:ml-20">
        <div className="mb-10 text-center">
          EkşiCode Yazılımcı Geliştirme Grupları'na hoşgeldiniz.
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form className="mb-10 text-sm font-normal text-gray-700 w-full">
            <div className="mb-6">
              <label htmlFor="username">Kullanıcı Adınız*</label>
              <Field
                type="text"
                name="username"
                placeholder="johndoe"
                className="block w-full px-4 py-2 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="email">E-posta Adresi*</label>
              <Field
                type="text"
                name="email"
                placeholder="johndoe@example.com"
                className="block w-full px-4 py-2 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password">Şifre Giriniz*</label>
              <Field
                type="password"
                name="password"
                placeholder="Şifre"
                className="block w-full px-4 py-2 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password">Şifre Tekrar*</label>
              <Field
                type="password"
                name="confirmPassword"
                placeholder="Şifre Tekrar"
                className="block w-full px-4 py-2 bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              />
              <ErrorMessage
                name="confirmPassword"
                component="div"
                className="text-red-500 mt-1"
              />
            </div>
            <div className="flex justify-between items-center mb-6">
              <label className="form-check-label inline-block text-gray-800">   

                <Field
                  type="checkbox"
                  name="userAgreement"
                  className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-eksiCode checked:border-eksiCode focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                />
                ekşiCode <Link href={"/kullanici-sozlesmesi"} target="_blank" className="hover:underline">kullanıcı sözleşmesini</Link> okudum ve kabul ediyorum
              <ErrorMessage
                name="userAgreement"
                component="div"
                className="text-red-500 mt-1"
              />
              </label>
            </div>

            <Button
              type="submit"
              onClick={() => {}}
              variant="secondary"
              clasName="w-full mb-6"
            >
              Üye Ol
            </Button>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default SignUpForm;
