async function loadComplaints() {

    try {

        const response =
            await fetch(
                "/api/complaints"
            );

        const complaints =
            await response.json();


        document.getElementById(
            "totalComplaints"
        ).textContent =
            complaints.length;


        document.getElementById(
            "openComplaints"
        ).textContent =
            complaints.filter(
                c => c.status === "Open"
            ).length;


        const container =
            document.getElementById(
                "complaints"
            );


        container.innerHTML = "";


        if (complaints.length === 0) {

            container.innerHTML =
                "<p>No complaints yet.</p>";

            return;
        }


        complaints.forEach(c => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "complaint";


            div.innerHTML = `

                <strong>
                    #${c.id} - ${c.category}
                </strong>

                <p>
                    ${c.description}
                </p>

                <small>
                    Submitted by:
                    ${c.student_name}
                </small>

                <br>
                <br>

                <span class="status">
                    ${c.status}
                </span>

            `;


            container.appendChild(div);

        });


    } catch (error) {

        console.error(error);

    }

}


document
    .getElementById("complaintForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const student_name =
                document.getElementById(
                    "student_name"
                ).value;


            const category =
                document.getElementById(
                    "category"
                ).value;


            const description =
                document.getElementById(
                    "description"
                ).value;


            const response =
                await fetch(
                    "/api/complaints",
                    {

                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                student_name,

                                category,

                                description

                            })

                    }
                );


            const result =
                await response.json();


            const message =
                document.getElementById(
                    "message"
                );


            message.textContent =
                result.message ||
                result.error;


            if (response.ok) {

                message.style.color =
                    "#16a34a";


                document
                    .getElementById(
                        "complaintForm"
                    )
                    .reset();


                loadComplaints();

            } else {

                message.style.color =
                    "#dc2626";

            }

        }
    );


loadComplaints();
