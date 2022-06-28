const { Classifier } = require('ml-classify-text')

export interface TrainingDataPoint {
	content: string;
	tags: string[];
}

export interface Prediction {
	label: string;
	confidence: number;
}

export class DocumentClassificationModel {
	private _classifier: typeof Classifier;

	constructor() {
		this._classifier = new Classifier({
			nGramMin: 1,
			nGramMax: 3
		});
	}


	predictTags(content: string): string[] {
		// Use this to train a classification model https://www.npmjs.com/package/ml-classify-text
		// Then return appropriate returns for each document
		let predictions: Array<Prediction> = this._classifier.predict(content.replace(/[^a-zA-Z ]/g, ""));
		return predictions.map((prediction) => {
			console.log(`${prediction.label} (${prediction.confidence})`)
			return prediction.label;
		})
	}

	bulkTrainModel(documents: Array<TrainingDataPoint>): void {
		// Use this to train a classification model https://www.npmjs.com/package/ml-classify-text
		// Then return appropriate returns for each document
		documents.forEach(document => {
			document.tags.forEach(tag => {
				this._classifier.train(document.content.replace(/[^a-zA-Z ]/g, ""), tag);
			});
		})
	}

	trainModel(document: TrainingDataPoint): void {
		// Use this to train a classification model https://www.npmjs.com/package/ml-classify-text
		// Then return appropriate returns for each document
			document.tags.forEach(tag => {

				try {
					this._classifier.train(document.content.replace(/[^a-zA-Z ]/g, ""), tag);
				} catch {
					console.log("TrainingDataPoint failed...")
				}

			});
	}

	serialize(): any {
		return this._classifier.serialize.model.serialize();
	}



}
