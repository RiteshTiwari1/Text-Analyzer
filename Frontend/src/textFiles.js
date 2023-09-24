import React, { useState } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory

function FileUploadComponent() {
  
  const [selectedFile, setSelectedFile] = useState(null);
  const history=useHistory();
  // Function to handle file input change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if a file is selected
    if (selectedFile) {
      // Create a FormData object to send the file to the server
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        // Send the FormData to the server (replace with your API endpoint)
        const response = await fetch('http://localhost:3000/uploadFile', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          // File uploaded successfully
          const responseData = await response.json();
          // Use history to navigate to the new page
          history.push({
            pathname: '/DisplayCards',
            state: { responseData }, // Pass your data as state
          });
        
          console.log('File uploaded successfully');
        } else {
          // File upload failed
          console.error('File upload failed');
        }
      } catch (error) {
        console.error('An error occurred:', error);
      }
    } else {
      // No file selected
      console.error('Please select a file to upload');
    }
  };

  return (
    <div>
      <h1>Upload Text File</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          name="file"
          onChange={handleFileChange}
        />
        <input type="submit" value="Submit" />
      </form>
    </div>
  );
}

export default FileUploadComponent;
