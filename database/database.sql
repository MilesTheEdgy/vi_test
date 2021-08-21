CREATE DATABASE varoliletisim;

INSERT INTO users(user_username, user_hash, user_role, user_full_name)
VALUES ('muhammet', '$2b$10$Dby9vVg6jidFaFX.GdmMZOuEZPkbhzraDGy1MBQNv9h.WsRCPj0FC', 'admin', 'muhammet aldulaimi');








-- FOR SALES ASSISTANT CHEF GET USER'S SUBMISSIONS ACCORDING TO SELECTED SERVICE TYPE
SELECT sales_applications.submitter, sales_applications_details.client_name, sales_applications.status
FROM sales_applications
INNER JOIN sales_applications_details
ON sales_applications.id=sales_applications_details.id 
WHERE sales_applications.id IN (SELECT id FROM sales_applications_details WHERE selected_service = 'DSL')
AND submitter = (SELECT username FROM login WHERE id = 2)