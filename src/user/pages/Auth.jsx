import { useContext, useState } from "react";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/form-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Card from "../../shared/components/UIElements/Card";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Input from "../../shared/components/FormElements/Input";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import Button from "../../shared/components/FormElements/Button";
import "./Auth.css";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    const email = formState.inputs.email.value;
    const password = formState.inputs.password.value;

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + "/users/login",
          "POST",
          JSON.stringify({
            email: email,
            password: password,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        if (responseData && responseData.userId) {
          auth.login(responseData.userId, responseData.token);
        }
      } catch (err) {
        console.error("Login Error:", err);
      }
    } else {
      const name = formState.inputs.name.value;
      try {
        const formData = new FormData();
        formData.append("email", email);
        formData.append("name", name);
        formData.append("password", password);

        if (formState.inputs.image.value) {
          const imageFile = formState.inputs.image.value;
          if (imageFile instanceof File) {
            formData.append("image", imageFile);
          } else {
            console.error("Invalid file format for image");
          }
        }

        const responseData = await sendRequest(
          import.meta.env.VITE_BACKEND_URL + "/users/signup",
          "POST",
          formData
        );
        if (responseData && responseData.userId) {
          auth.login(responseData.userId, responseData.token);
        }
      } catch (err) {
        console.error("Signup Error:", err);
      }
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please Enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              errorText="Please provide an Image"
            />
          )}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            placeholder="Email Address"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a Valid Email Address"
            onInput={inputHandler}
          />
          <Input
            element="input"
            type="password"
            id="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please Enter a valid Password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "LOGIN" : "SIGN UP"}
          </Button>
        </form>
        <br />
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? "SIGN UP" : "LOGIN"}
        </Button>
      </Card>
    </>
  );
};

export default Auth;