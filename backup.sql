--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."User" (id, "firstName", "lastName", email, "phoneNumber", "loginConfirmedAt", role, "createdAt", "updatedAt", points, password) VALUES ('961691fe-97fc-4cb8-bf84-e3f603fc1e7e', 'Ghyath', 'ghghghasdf', NULL, '555555', NULL, 'USER', '2021-09-10 18:46:24.493', '2021-09-11 16:12:09.72', 0, NULL);
INSERT INTO public."User" (id, "firstName", "lastName", email, "phoneNumber", "loginConfirmedAt", role, "createdAt", "updatedAt", points, password) VALUES ('1', 'Admin', 'a', 'admin@squeezecleaning.com', '000000', '2021-09-02 14:15:19', 'ADMIN', '2021-09-02 14:15:19', '2021-09-02 14:15:19', 0, '$2a$12$4VVCnePshaZzyPlB1uR98urfYoRl3qYKLvLLAG0lzc5Nu3fcr3qSq');
INSERT INTO public."User" (id, "firstName", "lastName", email, "phoneNumber", "loginConfirmedAt", role, "createdAt", "updatedAt", points, password) VALUES ('23c8d856-2596-4d61-b1f5-93893221465c', 'Ahmad', 'Dar', 'Adar@ggh.nnn ', '971512355555', NULL, 'USER', '2021-09-10 19:04:45.631', '2021-09-10 19:16:02.082', 0, NULL);
INSERT INTO public."User" (id, "firstName", "lastName", email, "phoneNumber", "loginConfirmedAt", role, "createdAt", "updatedAt", points, password) VALUES ('218239f6-ffa7-46c2-8234-7aaee1524b13', 'asd', 'asd', NULL, '123', NULL, 'USER', '2021-09-10 22:12:40.418', '2021-09-10 22:12:40.418', 0, NULL);


--
-- Data for Name: Address; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Address" (id, city, area, place, "placeNumber", "phoneNumber", "buildingName", "primary", "createdAt", "updatedAt", "userId") VALUES (2, 'He', 'afa', 'fee', '234234', '2342342', 'fae', true, '2021-09-10 22:11:10', '2021-09-10 22:11:10', '961691fe-97fc-4cb8-bf84-e3f603fc1e7e');


--
-- Data for Name: Service; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Service" (id, name, name_ar, "createdAt") VALUES (1, 'Standard Cleaning', 'تنظيف عادي', '2021-08-22 19:52:14');
INSERT INTO public."Service" (id, name, name_ar, "createdAt") VALUES (2, 'Deep Cleaning', 'التنظيف العميق', '2021-08-25 00:06:56');
INSERT INTO public."Service" (id, name, name_ar, "createdAt") VALUES (3, 'Home Laundry', 'الغسيل المنزلي', '2021-08-25 00:11:32');
INSERT INTO public."Service" (id, name, name_ar, "createdAt") VALUES (4, 'Carpet & Sofa Cleaning', 'تنظيف السجاد والأريكة', '2021-08-25 00:13:22');
INSERT INTO public."Service" (id, name, name_ar, "createdAt") VALUES (5, 'Car Wash', 'غسيل السيارة', '2021-08-25 00:13:53');
INSERT INTO public."Service" (id, name, name_ar, "createdAt") VALUES (6, 'Maintenance', 'صيانة', '2021-08-25 00:14:38');


--
-- Data for Name: Order; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Order" (id, status, "userId", "addressId", "serviceId", details, "createdAt", "updatedAt") VALUES ('8e3e8044-855e-44fe-aafd-74db93d3acb2', 'In Progress', '961691fe-97fc-4cb8-bf84-e3f603fc1e7e', 2, 5, '{}', '2021-09-10 20:11:00.552', '2021-09-10 20:11:00.552');
INSERT INTO public."Order" (id, status, "userId", "addressId", "serviceId", details, "createdAt", "updatedAt") VALUES ('e0332baf-538d-427e-8860-e5bb6eed6405', 'In Progress', '961691fe-97fc-4cb8-bf84-e3f603fc1e7e', 2, 5, '{}', '2021-09-10 20:12:41.103', '2021-09-10 20:12:41.103');
INSERT INTO public."Order" (id, status, "userId", "addressId", "serviceId", details, "createdAt", "updatedAt") VALUES ('510c69c0-6e4c-4819-98ff-b1f2ac245759', 'In Progress', '961691fe-97fc-4cb8-bf84-e3f603fc1e7e', 2, 5, '{}', '2021-09-10 20:25:00.096', '2021-09-10 20:25:00.096');
INSERT INTO public."Order" (id, status, "userId", "addressId", "serviceId", details, "createdAt", "updatedAt") VALUES ('11cae464-4a54-46ba-a222-fd6f8d820801', 'In Progress', '961691fe-97fc-4cb8-bf84-e3f603fc1e7e', 2, 5, '{}', '2021-09-10 20:29:48.204', '2021-09-10 20:29:48.204');
INSERT INTO public."Order" (id, status, "userId", "addressId", "serviceId", details, "createdAt", "updatedAt") VALUES ('2ff4f3c0-ec6b-4f52-970a-e52ed7fb6b03', 'In Progress', '961691fe-97fc-4cb8-bf84-e3f603fc1e7e', 2, 5, '{}', '2021-09-10 20:30:16.469', '2021-09-10 20:30:16.469');
INSERT INTO public."Order" (id, status, "userId", "addressId", "serviceId", details, "createdAt", "updatedAt") VALUES ('0f903de4-0273-4723-8abc-9393ba77cb44', 'In Progress', '961691fe-97fc-4cb8-bf84-e3f603fc1e7e', 2, 5, '{}', '2021-09-10 20:31:59.947', '2021-09-10 20:31:59.948');
INSERT INTO public."Order" (id, status, "userId", "addressId", "serviceId", details, "createdAt", "updatedAt") VALUES ('d8b56abc-0f82-4d70-8f98-a12a3d89c5c3', 'In Progress', '961691fe-97fc-4cb8-bf84-e3f603fc1e7e', 2, 5, '{}', '2021-09-10 20:32:36.319', '2021-09-10 20:32:36.319');
INSERT INTO public."Order" (id, status, "userId", "addressId", "serviceId", details, "createdAt", "updatedAt") VALUES ('1cedba3f-0bdd-41b7-a1b7-2e795db80766', 'In Progress', '961691fe-97fc-4cb8-bf84-e3f603fc1e7e', 2, 5, '{}', '2021-09-10 20:35:33.159', '2021-09-10 20:35:33.159');
INSERT INTO public."Order" (id, status, "userId", "addressId", "serviceId", details, "createdAt", "updatedAt") VALUES ('94d3a826-a93c-4f1c-b874-8d81f5f4123e', 'In Progress', '961691fe-97fc-4cb8-bf84-e3f603fc1e7e', 2, 5, '{}', '2021-09-10 20:37:53.031', '2021-09-10 20:37:53.031');


--
-- Data for Name: Step; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."Step" (id, name, index) VALUES (1, 'a', 1);
INSERT INTO public."Step" (id, name, index) VALUES (2, 'b', 2);
INSERT INTO public."Step" (id, name, index) VALUES (3, 'common-last', 99);


--
-- Data for Name: StepOption; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."StepOption" (id, name, name_ar, description, description_ar, index, settings, "stepId", "parentId", type) VALUES (5, 'Add extra', 'أضف المزيد', 'Add extra', 'أضف المزيد', 5, '{"list": [{"cost": 10, "text": "Fridge Cleaning", "value": "fridge-cleaning"}, {"cost": 10, "text": "Oven Cleaning", "value": "oven-cleaning"}, {"cost": 30, "text": "Laundary", "value": "laundary"}, {"cost": 10, "text": "Ironing & Folding", "value": "ironing-folding"}, {"cost": 20, "text": "Organizing", "value": "organizing"}, {"cost": 20, "text": "Carpet Cleaning", "value": "carpet-cleaning"}], "price": {"costPlusPrice": true}, "scrollable": false, "multiSelect": true}', 2, NULL, 'ICONIC_SELECT');
INSERT INTO public."StepOption" (id, name, name_ar, description, description_ar, index, settings, "stepId", "parentId", type) VALUES (2, 'Number of rooms', 'عدد الغرف', 'Number of rooms', 'عدد الغرف', 2, '{"list": [{"text": "S", "value": 1}, {"text": "1", "value": 1}, {"text": "2", "value": 2}, {"text": "3", "value": 3}, {"text": "4", "value": 4}, {"text": "5", "value": 5}, {"text": "6", "value": 6}]}', 1, 1, 'NUMBER_SELECT');
INSERT INTO public."StepOption" (id, name, name_ar, description, description_ar, index, settings, "stepId", "parentId", type) VALUES (3, 'Cleaning hours', 'ساعات التنظيف', 'Cleaning hours', 'ساعات التنظيف', 3, '{"list": [{"text": "2", "value": 2}, {"text": "3", "value": 3}, {"text": "4", "value": 4}, {"text": "5", "value": 5}, {"text": "6", "value": 6}, {"text": "7", "value": 7}, {"text": "8", "value": 8}], "price": {"costTimesValue": 30}}', 1, 1, 'NUMBER_SELECT');
INSERT INTO public."StepOption" (id, name, name_ar, description, description_ar, index, settings, "stepId", "parentId", type) VALUES (4, 'Cleaning staff', 'عدد العمال', 'Cleaning staff', 'عدد العمال', 4, '{"list": [{"text": "1", "value": 1}, {"text": "2", "value": 2}, {"text": "3", "value": 3}, {"text": "4", "value": 4}], "price": {"valueTimesPrice": true}}', 1, 1, 'NUMBER_SELECT');
INSERT INTO public."StepOption" (id, name, name_ar, description, description_ar, index, settings, "stepId", "parentId", type) VALUES (6, 'Select frequency', 'حدد كم مرة', 'Select frequency', 'حدد كم مرة', 6, '{"list": [{"text": "One Time", "value": "one-time"}, {"text": "Weekly", "value": "weekly"}, {"text": "Bi-Weekly", "value": "bi-weekly"}, {"text": "Monthly", "value": "monthly"}]}', 2, NULL, 'SIMPLE_SELECT');
INSERT INTO public."StepOption" (id, name, name_ar, description, description_ar, index, settings, "stepId", "parentId", type) VALUES (9, 'Select address', 'حدد عنوان', 'Select address', 'حدد عنوان', 9, '{"list": [{"text": "Ahmad Darwesh", "value": "address2"}]}', 3, NULL, 'ADDRESS_MODEL');
INSERT INTO public."StepOption" (id, name, name_ar, description, description_ar, index, settings, "stepId", "parentId", type) VALUES (1, 'Property type', 'نوع الملكية', 'Property type', 'نوع الملكية', 1, '{"list": [{"text": "Apprtment", "value": "apprtment"}, {"text": "Villa", "value": "villa"}, {"text": "Office", "value": "office"}, {"text": "Shop", "value": "shop"}], "scrollable": true, "multiSelect": false}', 1, NULL, 'ICONIC_SELECT');
INSERT INTO public."StepOption" (id, name, name_ar, description, description_ar, index, settings, "stepId", "parentId", type) VALUES (7, 'Select date', 'حدد التاريخ', 'Select date', 'حدد التاريخ', 7, '{"list": [{"text": "Sat 11", "value": "sat-11"}, {"text": "Sun 12", "value": "sun-12"}, {"text": "Mon 13", "value": "mon-13"}, {"text": "Tue 14", "value": "tue-12"}, {"text": "Wed 15", "value": "wed-15"}, {"text": "Thu 16", "value": "thu-16"}, {"text": "Fri 17", "value": "fri-17"}]}', 2, NULL, 'DATE_SELECT');
INSERT INTO public."StepOption" (id, name, name_ar, description, description_ar, index, settings, "stepId", "parentId", type) VALUES (8, 'Select time', 'حدد الوقت', 'Select time', 'حدد الوقت', 8, '{"list": [{"text": "08:00 AM", "value": "8am"}, {"text": "09:00 AM", "value": "9am"}, {"text": "10:00 AM", "value": "10am"}, {"text": "11:00 AM", "value": "11am"}, {"text": "12:00 AM", "value": "12am"}, {"text": "12:00 AM", "value": "12am"}, {"text": "01:00 AM", "value": "1am"}]}', 2, NULL, 'SIMPLE_SELECT');
INSERT INTO public."StepOption" (id, name, name_ar, description, description_ar, index, settings, "stepId", "parentId", type) VALUES (10, 'Payment method', 'طريقة الدفع', 'Payment method', 'طريقة الدفع', 10, '{"list": [{"text": "Cash", "value": "cash"}, {"text": "Credit Card", "value": "credit-card"}]}', 3, NULL, 'PAYMENT_METHOD');
INSERT INTO public."StepOption" (id, name, name_ar, description, description_ar, index, settings, "stepId", "parentId", type) VALUES (11, 'Any specific instructions?', 'أي تعليمات اضافية؟', 'Any specific instructions?', 'أي تعليمات اضافية؟', 11, '{"list": [{"text": "text-area", "value": "value"}]}', 3, NULL, 'TEXTAREA');


--
-- Data for Name: _ServiceToStep; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."_ServiceToStep" ("A", "B") VALUES (1, 1);
INSERT INTO public."_ServiceToStep" ("A", "B") VALUES (1, 2);
INSERT INTO public."_ServiceToStep" ("A", "B") VALUES (1, 3);


--
-- Name: Address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Address_id_seq"', 4, true);


--
-- Name: Service_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Service_id_seq"', 1, false);


--
-- Name: StepOption_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."StepOption_id_seq"', 11, true);


--
-- Name: StepOption_index_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."StepOption_index_seq"', 11, true);


--
-- Name: Step_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Step_id_seq"', 3, true);


--
-- PostgreSQL database dump complete
--

