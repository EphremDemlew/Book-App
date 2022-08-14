import React, { useState } from "react";
import "./App.css";

const FILE_UPLOAD_MUTATION = `
mutation addBook($book_file_base64str: String!,$book_file_name: String!,$book_file_type: String!,$comment: String!,$cover_photo_base64str: String!,$cover_photo_name: String!,$description: String!,$ISBN: String!,$edition: Int!,$page_size: Int!,$price: Float!,$sample_file_base64str: String!,$sample_file_name:String! , $sample_file_type:String! ,$title: String!,$cover_photo_type: String!,$rating:Float!) {
  addBook(book_file_base64str: $book_file_base64str, book_file_name: $book_file_name, book_file_type: $book_file_type, comment: $comment, cover_photo_base64str: $cover_photo_base64str, cover_photo_name: $cover_photo_name, description: $description, ISBN: $ISBN, edition: $edition, page_size: $page_size, price: $price, sample_file_base64str: $sample_file_base64str, sample_file_name: $sample_file_name, sample_file_type: $sample_file_type, title: $title, cover_photo_type: $cover_photo_type, rating: $rating) {
    book_file_path
    cover_photo_path
    sample_file_path
  }
}
`;
function App() {
  const [file, setFile] = useState(null);
  const [base64, setBase64Str] = useState(null);
  const [filepath, setFilePath] = useState(null);
  const fileUpload = (file) => {
    // make fetch api call to upload file
    const fileName = file.name;
    const fileType = file.type;
    const variables = {
      Image_name: fileName,
      type: fileType,
      base64: base64,
    };
    const url = "http://localhost:8080/v1/graphql";
    const options = {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-hasura-admin-secret": "myadminsecretkey",
      },
      body: JSON.stringify({
        query: FILE_UPLOAD_MUTATION,
        variables: variables,
      }),
    };

    fetch(url, options)
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          console.log(res.errors);
          alert("Something went wrong");
        } else {
          console.log(res);

          setFilePath(res.data.fileUpload.imagePath);
        }
      });
  };

  // const onChange = (e) => {
  //   setFile(e.target.files[0]);
  //   const reader = new FileReader();
  //   if (e.target.files[0]) {
  //     reader.readAsBinaryString(e.target.files[0]);
  //   }
  //   reader.onload = function () {
  //     const base64 = btoa(reader.result);
  //     // console.log(btoa(reader.result));
  //     // const base64 = Buffer.from(reader.result, "utf8").toString("base64");
  //     setBase64Str(base64);
  //   };

  //   reader.onerror = function () {
  //     console.log("Unable to parse file");
  //   };
  // };
  const textOnChange = (e) => {
    setFile(e.target.files[0]);
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsBinaryString(e.target.files[0]);
    }
    reader.onload = function () {
      const base64 = btoa(reader.result);
      // console.log(btoa(reader.result));
      // const base64 = Buffer.from(reader.result, "utf8").toString("base64");
      setBase64Str(base64);
    };

    reader.onerror = function () {
      console.log("Unable to parse file");
    };
  };
  const imageOnChange = (e) => {
    setFile(e.target.files[0]);
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsBinaryString(e.target.files[0]);
    }
    reader.onload = function () {
      const base64 = btoa(reader.result);
      // console.log(btoa(reader.result));
      // const base64 = Buffer.from(reader.result, "utf8").toString("base64");
      setBase64Str(base64);
    };

    reader.onerror = function () {
      console.log("Unable to parse file");
    };
  };
  const sampleOnChange = (e) => {
    setFile(e.target.files[0]);
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsBinaryString(e.target.files[0]);
    }
    reader.onload = function () {
      const base64 = btoa(reader.result);
      // console.log(btoa(reader.result));
      // const base64 = Buffer.from(reader.result, "utf8").toString("base64");
      setBase64Str(base64);
    };

    reader.onerror = function () {
      console.log("Unable to parse file");
    };
  };
  const onFormSubmit = (e) => {
    e.preventDefault(); // Stop form submit
    fileUpload(file);
  };
  return (
    <div className="App">
      <form onSubmit={onFormSubmit}>
        <h1>File Upload</h1>
        <h1>text </h1>
        <input type="file" onChange={textOnChange} required />
        <h1>image </h1>
        <input type="file" onChange={sampleOnChange} required />
        <h1>sample </h1>
        <input type="file" onChange={imageOnChange} required />

        <button type="submit">Upload</button>
      </form>
      <div>
        {filepath ? (
          <a href={`http://localhost:5000${filepath}`}>Open file</a>
        ) : null}
      </div>
    </div>
  );
}

export default App;
