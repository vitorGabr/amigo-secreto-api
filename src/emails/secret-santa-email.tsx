import { Section, Tailwind, Text } from "@react-email/components";
import * as React from "react";

interface Props {
	eventName: string;
	giftee: string;
	recipientName: string;
}

export default function SecretSantaEmail({
	eventName,
	giftee,
	recipientName,
}: Props) {
	return (
		<Tailwind>
			<Section className="bg-gray-100 font-sans">
				<Section className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
					<Text className="text-lg font-semibold mb-4 text-indigo-600">
						{eventName}
					</Text>
					<Text className="mb-4">Olá {recipientName},</Text>
					<Text className="mb-4">
						Você tirou o nome de <Text className="font-bold">{giftee}</Text> no
						nosso amigo secreto! Prepare um presente especial para tornar este
						evento ainda mais memorável.
					</Text>
					<Text className="mb-4">
						Fique à vontade para entrar em contato caso tenha alguma dúvida.
					</Text>

					<Text className="text-sm text-gray-500">Boas festas!</Text>
				</Section>
			</Section>
		</Tailwind>
	);
}

SecretSantaEmail.PreviewProps = {
	eventName: "Amigo Secreto de Natal",
	giftee: "João Silva",
	recipientName: "Maria Souza",
};
