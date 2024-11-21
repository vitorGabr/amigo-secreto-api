import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";
import * as React from "react";

interface GiftAssignmentEmailProps {
	participantName: string;
	recipientName: string;
	eventName: string;
	ownerName: string;
	description?: string;
	budget?: number;
	eventDate?: Date;
}

export default function GiftAssignmentEmail({
	participantName,
	recipientName,
	eventName,
	description,
	budget,
	eventDate,
	ownerName,
}: GiftAssignmentEmailProps) {
	return (
		<Html>
			<Head />
			<Preview>{participantName}</Preview>
			<Tailwind>
				<Body className="bg-gray-50 font-sans">
					<Container className="mx-auto py-20 px-4">
						<Section className="bg-white rounded-xl shadow-lg overflow-hidden max-w-2xl mx-auto">
							<Heading className="text-3xl font-bold text-center text-gray-800 pt-8 px-8">
								Seu amigo secreto foi sorteado! 🎁
							</Heading>

							<Section className="p-8">
								<Text className="text-gray-700 text-base mb-4">
									Olá {participantName},
								</Text>
								<Text className="text-gray-700 text-base mb-6">
									O momento que você estava esperando chegou! Você foi
									selecionado para ser o presenteador de:
								</Text>

								<Text className="text-2xl font-bold text-center bg-indigo-50 text-indigo-800 py-6 px-4 rounded-lg mb-8">
									✨ {recipientName} ✨
								</Text>

								{description && (
									<Text className="text-gray-700 text-base mb-4">
										Aqui estão os detalhes importantes para {eventName}:
									</Text>
								)}

								<Section className="bg-gray-50 rounded-lg p-6 mb-8">
									<Text className="text-gray-700 text-base mb-2">
										🎯 Orçamento:{" "}
										{budget
											? budget.toLocaleString("pt-BR", {
													style: "currency",
													currency: "BRL",
												})
											: "Não informado"}
									</Text>

									{
										<Text className="text-gray-700 text-base">
											📅 Data da Troca:{" "}
											{eventDate
												? new Date(eventDate).toLocaleDateString()
												: "Não informada"}
										</Text>
									}
								</Section>

								<Hr className="border-gray-200 my-8" />

								<Text className="text-gray-700 text-base mb-8">
									Lembre-se de manter isso em segredo! Isso é o que torna
									especial. Se precisar de ajuda ou tiver dúvidas, sinta-se à
									vontade para entrar em contato com {ownerName}.
								</Text>

								<Text className="text-gray-500 text-sm text-center mt-8">
									Boas festas e boa sorte! 🎄
								</Text>
							</Section>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

GiftAssignmentEmail.PreviewProps = {
	participantName: "João",
	recipientName: "Maria",
	eventName: "Amigo Secreto",
	ownerName: "Ana",
	description: "Troca de presentes",
	budget: 50,
	eventDate: new Date(),
}