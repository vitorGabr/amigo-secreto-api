import {
	Html,
	Head,
	Preview,
	Body,
	Container,
	Section,
	Text,
} from "@react-email/components";
// biome-ignore lint/style/useImportType: <explanation>
import * as React from "react";

interface GiftAssignmentEmailProps {
	participantName: string;
	recipientName: string;
	eventName: string;
	customMessage?: string;
}

export const GiftAssignmentEmail: React.FC<GiftAssignmentEmailProps> = ({
	participantName,
	recipientName,
	eventName,
	customMessage,
}) => {
	return (
		<Html>
			<Head />
			<Preview>Você foi sorteado no evento {eventName}!</Preview>
			<Body
				style={{
					fontFamily: "Arial, sans-serif",
					backgroundColor: "#f4f4f4",
					padding: "20px",
				}}
			>
				<Container
					style={{
						backgroundColor: "#ffffff",
						borderRadius: "8px",
						padding: "20px",
					}}
				>
					<Section>
						<Text
							style={{
								fontSize: "20px",
								fontWeight: "bold",
								marginBottom: "20px",
							}}
						>
							Olá, {participantName}!
						</Text>
						<Text
							style={{
								fontSize: "16px",
								lineHeight: "1.5",
								marginBottom: "10px",
							}}
						>
							Você foi sorteado no evento <strong>{eventName}</strong>. Aqui
							estão os detalhes:
						</Text>
						<Text
							style={{
								fontSize: "16px",
								lineHeight: "1.5",
								marginBottom: "20px",
							}}
						>
							Você deve presentear: <strong>{recipientName}</strong>
						</Text>
						{customMessage && (
							<Text
								style={{
									fontSize: "14px",
									fontStyle: "italic",
									marginBottom: "20px",
								}}
							>
								Mensagem do organizador: "{customMessage}"
							</Text>
						)}
						<Text
							style={{ fontSize: "14px", lineHeight: "1.5", color: "#777" }}
						>
							Obrigado por participar e boas festas! 🎉
						</Text>
					</Section>
				</Container>
			</Body>
		</Html>
	);
};
